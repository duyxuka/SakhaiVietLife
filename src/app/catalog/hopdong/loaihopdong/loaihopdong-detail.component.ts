import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { ValidationMessageComponent } from 'src/app/shared/modules/validation-message/validation-message.component';
import { StandaloneSharedModule } from '@/standaloneshare.module';
import { LoaiHopDongDto } from '@/proxy/viet-life/catalog/hop-dongs/loai-hop-dongs';
import { LoaiHopDongsService } from '@/proxy/viet-life/catalog/hop-dongs';

@Component({
  selector: 'app-loai-hop-dong-detail',
  templateUrl: './loaihopdong-detail.component.html',
  standalone: true,
  imports: [
    StandaloneSharedModule,
    ValidationMessageComponent
  ]
})
export class LoaiHopDongDetailComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject<void>();
  blockedPanel = false;
  btnDisabled = false;
  form: FormGroup;
  selectedEntity = {} as LoaiHopDongDto;

  validationMessages = {
    tenLoai: [
      { type: 'required', message: 'Bạn phải nhập tên loại hợp đồng' },
      { type: 'maxlength', message: 'Không được nhập quá 255 ký tự' },
    ]
  };

  constructor(
    private loaiHopDongService: LoaiHopDongsService,
    private fb: FormBuilder,
    private config: DynamicDialogConfig,
    private ref: DynamicDialogRef,
    private utilService: UtilityService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.initFormData();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    this.ref?.close();
  }

  private buildForm() {
    this.form = this.fb.group({
      tenLoai: new FormControl(this.selectedEntity.tenLoai || null, Validators.required),
      soThangMacDinh: new FormControl(this.selectedEntity.soThangMacDinh || null),
      macDinh: new FormControl(this.selectedEntity.macDinh || false)
    });
  }

  initFormData() {
    this.toggleBlockUI(true);
    if (!this.config.data?.id) {
      this.toggleBlockUI(false);
    } else {
      this.loadFormDetails(this.config.data.id);
    }
  }

  loadFormDetails(id: string) {
    this.toggleBlockUI(true);
    this.loaiHopDongService.get(id)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (res: LoaiHopDongDto) => {
          this.selectedEntity = res;
          this.buildForm();
          this.toggleBlockUI(false);
        },
        error: () => this.toggleBlockUI(false)
      });
  }

  saveChange() {
    this.toggleBlockUI(true);
    const obs = !this.config.data?.id
      ? this.loaiHopDongService.create(this.form.value)
      : this.loaiHopDongService.update(this.config.data.id, this.form.value);

    obs.pipe(takeUntil(this.ngUnsubscribe)).subscribe({
      next: () => this.ref.close(this.form.value),
      error: err => {
        this.notificationService.showError(err.error.error.message);
        this.toggleBlockUI(false);
      },
      complete: () => this.toggleBlockUI(false)
    });
  }

  private toggleBlockUI(enabled: boolean) {
    this.blockedPanel = enabled;
    this.btnDisabled = enabled;
  }

  cancel() {
    this.ref?.close();
  }
}
