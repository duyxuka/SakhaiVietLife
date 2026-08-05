import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';

import { NotificationService } from '@/shared/services/notification.service';
import { UtilityService } from '@/shared/services/utility.service';
import { StandaloneSharedModule } from '@/standaloneshare.module';
import { ValidationMessageComponent } from '@/shared/modules/validation-message/validation-message.component';
import { SeoConfigDto } from '@/proxy/viet-life/tuong-tac/insurer/seos';
import { SeoConfigService } from '@/proxy/viet-life/tuong-tac/insurers';

@Component({
  selector: 'app-seoconfig-detail.component',
  standalone: true,
  imports: [StandaloneSharedModule, ValidationMessageComponent],
  templateUrl: './seoconfig-detail.component.html',
})
export class SeoconfigDetailComponent implements OnInit, OnDestroy {
 
  private ngUnsubscribe = new Subject<void>();
 
  form!: FormGroup;
  selectedEntity = {} as SeoConfigDto;
 
  blockedPanel = false;
  btnDisabled = false;
 
  robotsOptions = [
    { label: 'index, follow', value: 'index, follow' },
    { label: 'index, nofollow', value: 'index, nofollow' },
    { label: 'noindex, follow', value: 'noindex, follow' },
    { label: 'noindex, nofollow', value: 'noindex, nofollow' },
  ];
 
  validationMessages = {
    pageKey: [
      { type: 'required', message: 'Bạn phải nhập Page Key' },
      { type: 'maxlength', message: 'Không quá 100 ký tự' },
    ],
    seoTitle: [
      { type: 'required', message: 'Bạn phải nhập SEO Title' },
      { type: 'maxlength', message: 'Không quá 70 ký tự' },
    ],
    seoDescription: [
      { type: 'maxlength', message: 'Không quá 160 ký tự' },
    ],
  };
 
  // Đếm ký tự
  get seoTitleLength(): number {
    return this.form?.get('seoTitle')?.value?.length ?? 0;
  }
 
  get seoDescriptionLength(): number {
    return this.form?.get('seoDescription')?.value?.length ?? 0;
  }
 
  constructor(
    private service: SeoConfigService,
    private fb: FormBuilder,
    public config: DynamicDialogConfig,
    private ref: DynamicDialogRef,
    private util: UtilityService,
    private notification: NotificationService,
  ) { }
 
  ngOnInit(): void {
    this.buildForm();
    this.initData();
  }
 
  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
 
  // ================== FORM ==================
 
  buildForm() {
    this.form = this.fb.group({
      pageKey: new FormControl(this.selectedEntity.pageKey || null, [
        Validators.required,
        Validators.maxLength(100)
      ]),
      seoTitle: new FormControl(this.selectedEntity.seoTitle || null, [
        Validators.required,
        Validators.maxLength(70)
      ]),
      seoKeywords: new FormControl(this.selectedEntity.seoKeywords || null),
      seoDescription: new FormControl(this.selectedEntity.seoDescription || null, [
        Validators.maxLength(160)
      ]),
      ogTitle: new FormControl(this.selectedEntity.ogTitle || null),
      ogDescription: new FormControl(this.selectedEntity.ogDescription || null),
      ogImageUrl: new FormControl(this.selectedEntity.ogImageUrl || null),
      canonicalUrl: new FormControl(this.selectedEntity.canonicalUrl || null),
      robots: new FormControl(this.selectedEntity.robots || 'index, follow'),
    });
  }
 
  // ================== DATA ==================
 
  initData() {
    if (this.util.isEmpty(this.config.data?.id)) return;
 
    this.toggleBlockUI(true);
    this.loadDetail(this.config.data.id);
  }
 
  loadDetail(id: string) {
    this.service.get(id)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: res => {
          this.selectedEntity = res;
          this.form.patchValue(res);
          this.toggleBlockUI(false);
        },
        error: () => this.toggleBlockUI(false)
      });
  }
 
  // ================== SAVE ==================
 
  saveChange() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
 
    this.toggleBlockUI(true);
 
    const request = this.util.isEmpty(this.config.data?.id)
      ? this.service.create(this.form.value)
      : this.service.update(this.config.data.id, this.form.value);
 
    request
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: () => {
          this.toggleBlockUI(false);
          this.ref.close(true);
        },
        error: err => {
          this.notification.showError(
            err.error?.error?.message || 'Có lỗi xảy ra'
          );
          this.toggleBlockUI(false);
        }
      });
  }
 
  cancel() {
    this.ref.close(false);
  }
 
  // ================== UI ==================
 
  private toggleBlockUI(enabled: boolean) {
    if (enabled) {
      this.blockedPanel = true;
      this.btnDisabled = true;
    } else {
      setTimeout(() => {
        this.blockedPanel = false;
        this.btnDisabled = false;
      }, 1000);
    }
  }
}
 
