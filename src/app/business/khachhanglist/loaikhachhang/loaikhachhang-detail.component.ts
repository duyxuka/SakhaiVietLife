import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { ValidationMessageComponent } from 'src/app/shared/modules/validation-message/validation-message.component';
import { StandaloneSharedModule } from '@/standaloneshare.module';
import { LoaiKhachHangDto } from '@/proxy/viet-life/business/khach-hangs-list/loai-khach-hangs';
import { LoaiKhachHangsService } from '@/proxy/viet-life/business/khach-hangs';

@Component({
  selector: 'app-loaikhachhang-detail',
  templateUrl: './loaikhachhang-detail.component.html',
  standalone: true,
  imports: [StandaloneSharedModule, ValidationMessageComponent],
})
export class LoaiKhachHangDetailComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject<void>();
  blockedPanel = false;
  btnDisabled = false;

  public form: FormGroup;
  selectedEntity = {} as LoaiKhachHangDto;

  constructor(
    private service: LoaiKhachHangsService,
    private fb: FormBuilder,
    private config: DynamicDialogConfig,
    private ref: DynamicDialogRef,
    private utilService: UtilityService,
    private notificationService: NotificationService
  ) {}

  validationMessages = {
    ten: [
      { type: 'required', message: 'Bạn phải nhập tên loại khách hàng' },
      { type: 'maxlength', message: 'Không được nhập quá 255 ký tự' },
    ],
  };

  ngOnInit(): void {
    this.buildForm();
    this.initFormData();
  }

  ngOnDestroy(): void {
    this.ref?.close();
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  private buildForm() {
    this.form = this.fb.group({
      ten: new FormControl(this.selectedEntity.ten || null, Validators.required),
      moTa: new FormControl(this.selectedEntity.moTa || null),
      hieuLuc: new FormControl(this.selectedEntity.hieuLuc ?? true)
    });
  }

  initFormData() {
    this.toggleBlockUI(true);

    if (this.utilService.isEmpty(this.config.data?.id)) {
      this.toggleBlockUI(false);
    } else {
      this.loadDetails(this.config.data.id);
    }
  }

  loadDetails(id: string) {
    this.service
      .get(id)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: response => {
          this.selectedEntity = response;
          this.buildForm();
          this.toggleBlockUI(false);
        },
        error: () => this.toggleBlockUI(false),
      });
  }

  saveChange() {
    this.toggleBlockUI(true);

    if (this.utilService.isEmpty(this.config.data?.id)) {
      this.service
        .create(this.form.value)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe({
          next: () => {
            this.toggleBlockUI(false);
            this.ref.close(this.form.value);
          },
          error: err => {
            this.notificationService.showError(err.error.error.message);
            this.toggleBlockUI(false);
          },
        });
    } else {
      this.service
        .update(this.config.data.id, this.form.value)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe({
          next: () => {
            this.toggleBlockUI(false);
            this.ref.close(this.form.value);
          },
          error: err => {
            this.notificationService.showError(err.error.error.message);
            this.toggleBlockUI(false);
          },
        });
    }
  }

  cancel() {
    this.ref.close();
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
}
