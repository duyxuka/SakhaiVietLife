import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';

import { NotificationService } from 'src/app/shared/services/notification.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { StandaloneSharedModule } from '../../standaloneshare.module';
import { ValidationMessageComponent } from 'src/app/shared/modules/validation-message/validation-message.component';
import { TienTeDto, TienTesService } from '@/proxy/viet-life/business/tien-tes';

@Component({
  selector: 'app-tiente-detail',
  templateUrl: './tiente-detail.component.html',
  standalone: true,
  imports: [StandaloneSharedModule, ValidationMessageComponent],
})
export class TienTeDetailComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject<void>();

  form: FormGroup;
  selectedEntity = {} as TienTeDto;

  blockedPanel = false;
  btnDisabled = false;

  constructor(
    private tienTeService: TienTesService,
    private fb: FormBuilder,
    private config: DynamicDialogConfig,
    private ref: DynamicDialogRef,
    private utilService: UtilityService,
    private notificationService: NotificationService
  ) {}

  validationMessages = {
    tenTienTe: [{ type: 'required', message: 'Bạn phải nhập tên tiền tệ' }],
    maTienTe: [{ type: 'required', message: 'Bạn phải nhập mã tiền tệ' }],
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
      tenTienTe: new FormControl(this.selectedEntity.tenTienTe || null, Validators.required),
      maTienTe: new FormControl(this.selectedEntity.maTienTe || null, Validators.required),
      tyGia: new FormControl(this.selectedEntity.tyGia || 1),
      macDinh: new FormControl(this.selectedEntity.macDinh || false),
    });
  }

  initFormData() {
    this.toggleBlockUI(true);
    if (this.utilService.isEmpty(this.config.data?.id)) {
      this.toggleBlockUI(false);
    }
    this.tienTeService
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
      ? this.tienTeService.update(this.config.data.id, this.form.value)
      : this.tienTeService.create(this.form.value);

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
