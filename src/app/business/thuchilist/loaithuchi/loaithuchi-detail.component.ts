import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { ValidationMessageComponent } from 'src/app/shared/modules/validation-message/validation-message.component';
import { StandaloneSharedModule } from '@/standaloneshare.module';
import { LoaiThuChiDto } from '@/proxy/viet-life/business/thu-chis-list/loai-thu-chis';
import { LoaiThuChisService } from '@/proxy/viet-life/business/thu-chis';

@Component({
  selector: 'app-loai-thu-chi-detail',
  templateUrl: './loaithuchi-detail.component.html',
  standalone: true,
  imports: [StandaloneSharedModule, ValidationMessageComponent],
})
export class LoaiThuChiDetailComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject<void>();

  form: FormGroup;
  selectedEntity = {} as LoaiThuChiDto;

  blockedPanel = false;
  btnDisabled = false;

  constructor(
    private loaiService: LoaiThuChisService,
    private fb: FormBuilder,
    private config: DynamicDialogConfig,
    private ref: DynamicDialogRef,
    private utilService: UtilityService,
    private notificationService: NotificationService
  ) {}

  validationMessages = {
    ten: [{ type: 'required', message: 'Bạn phải nhập tên loại thu chi' }],
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

  buildForm() {
    this.form = this.fb.group({
      ten: new FormControl(this.selectedEntity.ten || null, Validators.required),
      isThu: new FormControl(this.selectedEntity.isThu ?? true),
      moTa: new FormControl(this.selectedEntity.moTa || ''),
    });
  }

  initFormData() {
    this.toggleBlockUI(true);

    if (this.utilService.isEmpty(this.config.data?.id)) {
      this.toggleBlockUI(false);
      return;
    }

    this.loaiService
      .get(this.config.data.id)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (response) => {
          this.selectedEntity = response;
          this.buildForm();
          this.toggleBlockUI(false);
        },
        error: () => this.toggleBlockUI(false),
      });
  }

  saveChange() {
    this.toggleBlockUI(true);

    const request = this.config.data?.id
      ? this.loaiService.update(this.config.data.id, this.form.value)
      : this.loaiService.create(this.form.value);

    request.pipe(takeUntil(this.ngUnsubscribe)).subscribe({
      next: () => {
        this.toggleBlockUI(false);
        this.ref.close(this.form.value);
      },
      error: (err) => {
        this.notificationService.showError(err.error.error.message);
        this.toggleBlockUI(false);
      },
    });
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