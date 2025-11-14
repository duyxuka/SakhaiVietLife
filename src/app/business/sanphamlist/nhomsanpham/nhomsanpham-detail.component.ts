import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { ValidationMessageComponent } from 'src/app/shared/modules/validation-message/validation-message.component';
import { StandaloneSharedModule } from '@/standaloneshare.module';
import { NhomSanPhamDto } from '@/proxy/viet-life/business/san-phams-list/nhom-san-phams';
import { NhomSanPhamsService } from '@/proxy/viet-life/business/san-phams';

@Component({
  selector: 'app-nhomsanpham-detail',
  templateUrl: './nhomsanpham-detail.component.html',
  standalone: true,
  imports: [
    StandaloneSharedModule,
    ValidationMessageComponent
  ]
})
export class NhomSanPhamDetailComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject<void>();
  blockedPanel: boolean = false;
  btnDisabled = false;
  public form: FormGroup;
  selectedEntity = {} as NhomSanPhamDto;

  validationMessages = {
    tenNhom: [
      { type: 'required', message: 'Bạn phải nhập tên nhóm sản phẩm' },
      { type: 'maxlength', message: 'Bạn không được nhập quá 255 kí tự' },
    ],
    maNhom: [
      { type: 'required', message: 'Bạn phải nhập mã nhóm sản phẩm' },
      { type: 'maxlength', message: 'Bạn không được nhập quá 50 kí tự' },
    ]
  };

  constructor(
    private nhomSanPhamService: NhomSanPhamsService,
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
      tenNhom: new FormControl(this.selectedEntity.tenNhom || null, [Validators.required, Validators.maxLength(255)]),
      maNhom: new FormControl(this.selectedEntity.maNhom || null, [Validators.required, Validators.maxLength(50)]),
      hieuLuc: new FormControl(this.selectedEntity.hieuLuc ?? true)
    });
  }

  initFormData() {
    this.toggleBlockUI(true);
    if (this.utilService.isEmpty(this.config.data?.id)) {
      this.toggleBlockUI(false);
    } else {
      this.loadFormDetails(this.config.data?.id);
    }
  }

  loadFormDetails(id: string) {
    this.toggleBlockUI(true);
    this.nhomSanPhamService.get(id).pipe(takeUntil(this.ngUnsubscribe)).subscribe({
      next: (res: NhomSanPhamDto) => {
        this.selectedEntity = res;
        this.buildForm();
        this.toggleBlockUI(false);
      },
      error: () => this.toggleBlockUI(false)
    });
  }

  saveChange() {
    this.toggleBlockUI(true);
    if (this.utilService.isEmpty(this.config.data?.id)) {
      this.nhomSanPhamService.create(this.form.value).pipe(takeUntil(this.ngUnsubscribe)).subscribe({
        next: () => {
          this.toggleBlockUI(false);
          this.ref.close(this.form.value);
        },
        error: err => {
          this.notificationService.showError(err.error.error.message);
          this.toggleBlockUI(false);
        }
      });
    } else {
      this.nhomSanPhamService.update(this.config.data?.id, this.form.value).pipe(takeUntil(this.ngUnsubscribe)).subscribe({
        next: () => {
          this.toggleBlockUI(false);
          this.ref.close(this.form.value);
        },
        error: err => {
          this.notificationService.showError(err.error.error.message);
          this.toggleBlockUI(false);
        }
      });
    }
  }

  cancel() {
    this.ref?.close();
  }

  private toggleBlockUI(enabled: boolean) {
    if (enabled) {
      this.blockedPanel = true;
      this.btnDisabled = true;
    } else {
      setTimeout(() => {
        this.blockedPanel = false;
        this.btnDisabled = false;
      }, 500);
    }
  }
}
