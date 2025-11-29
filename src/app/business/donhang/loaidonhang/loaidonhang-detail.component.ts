import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { ValidationMessageComponent } from 'src/app/shared/modules/validation-message/validation-message.component';
import { StandaloneSharedModule } from '@/standaloneshare.module';
import { LoaiDonHangDto } from '@/proxy/viet-life/business/don-hangs-list/loai-don-hangs';
import { LoaiDonHangsService } from '@/proxy/viet-life/business/don-hangs';

@Component({
  selector: 'app-loai-don-hang-detail',
  templateUrl: './loaidonhang-detail.component.html',
  standalone: true,
  imports: [StandaloneSharedModule, ValidationMessageComponent]
})
export class LoaiDonHangDetailComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject<void>();
  blockedPanel = false;
  btnDisabled = false;
  form: FormGroup;
  selectedEntity = {} as LoaiDonHangDto;

  validationMessages = {
    tenLoai: [
      { type: 'required', message: 'Bạn phải nhập tên loại đơn hàng' },
      { type: 'maxlength', message: 'Tên loại không được quá 255 ký tự' }
    ]
  };

  constructor(
    private loaiDonHangService: LoaiDonHangsService,
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
    this.loaiDonHangService.get(id)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (res: LoaiDonHangDto) => {
          this.selectedEntity = res;
          this.buildForm();
          this.toggleBlockUI(false);
        },
        error: () => this.toggleBlockUI(false)
      });
  }

  saveChange() {
    this.toggleBlockUI(true);
    const obs = this.utilService.isEmpty(this.config.data?.id)
      ? this.loaiDonHangService.create(this.form.value)
      : this.loaiDonHangService.update(this.config.data.id, this.form.value);

    obs.pipe(takeUntil(this.ngUnsubscribe)).subscribe({
      next: () => {
        this.toggleBlockUI(false);
        this.ref.close(this.form.value);
      },
      error: err => {
        this.notificationService.showError(err.error?.error?.message || 'Lỗi hệ thống');
        this.toggleBlockUI(false);
      }
    });
  }

  private buildForm() {
    this.form = this.fb.group({
      tenLoai: new FormControl(this.selectedEntity.tenLoai || null, [Validators.required, Validators.maxLength(255)]),
      hieuLuc: new FormControl(this.selectedEntity.hieuLuc ?? true),
      tuDongXuatKho: new FormControl(this.selectedEntity.tuDongXuatKho ?? false)
    });
  }

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

  cancel() {
    this.ref?.close();
  }
}
