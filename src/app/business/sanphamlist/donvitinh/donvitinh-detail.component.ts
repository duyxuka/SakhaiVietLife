import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { StandaloneSharedModule } from '@/standaloneshare.module';
import { ValidationMessageComponent } from 'src/app/shared/modules/validation-message/validation-message.component';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { DonViTinhDto } from '@/proxy/viet-life/business/san-phams-list/don-vi-tinhs';
import { DonViTinhsService } from '@/proxy/viet-life/business/san-phams';

@Component({
  selector: 'app-donvitinh-detail',
  templateUrl: './donvitinh-detail.component.html',
  standalone: true,
  imports: [StandaloneSharedModule, ValidationMessageComponent]
})
export class DonViTinhDetailComponent implements OnInit, OnDestroy {

  private ngUnsubscribe = new Subject<void>();
  blockedPanel = false;
  btnDisabled = false;
  form: FormGroup;
  selectedEntity = {} as DonViTinhDto;

  validationMessages = {
    tenDonVi: [
      { type: 'required', message: 'Bạn phải nhập tên đơn vị tính' },
      { type: 'maxlength', message: 'Bạn không được nhập quá 255 kí tự' },
    ]
  };

  constructor(
    private donViTinhService: DonViTinhsService,
    private fb: FormBuilder,
    private config: DynamicDialogConfig,
    private ref: DynamicDialogRef,
    private util: UtilityService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.initData();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    this.ref.close();
  }

  private buildForm() {
    this.form = this.fb.group({
      tenDonVi: new FormControl(this.selectedEntity.tenDonVi || null, 
        [Validators.required, Validators.maxLength(255)]
      ),
      macDinh: new FormControl(this.selectedEntity.macDinh ?? false)
    });
  }

  initData() {
    this.toggleBlockUI(true);

    if (this.util.isEmpty(this.config.data?.id)) {
      this.toggleBlockUI(false);
    } else {
      this.loadDetails(this.config.data.id);
    }
  }

  loadDetails(id: string) {
    this.donViTinhService.get(id).pipe(takeUntil(this.ngUnsubscribe)).subscribe({
      next: (res) => {
        this.selectedEntity = res;
        this.buildForm();
        this.toggleBlockUI(false);
      },
      error: () => this.toggleBlockUI(false)
    });
  }

  saveChange() {
    this.toggleBlockUI(true);

    if (this.util.isEmpty(this.config.data?.id)) {
      this.donViTinhService.create(this.form.value).pipe(takeUntil(this.ngUnsubscribe)).subscribe({
        next: () => {
          this.toggleBlockUI(false);
          this.ref.close(this.form.value);
        },
        error: (err) => {
          this.notificationService.showError(err.error.error.message);
          this.toggleBlockUI(false);
        }
      });
    } else {
      this.donViTinhService.update(this.config.data?.id, this.form.value)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe({
          next: () => {
            this.toggleBlockUI(false);
            this.ref.close(this.form.value);
          },
          error: (err) => {
            this.notificationService.showError(err.error.error.message);
            this.toggleBlockUI(false);
          }
        });
    }
  }

  cancel() {
    this.ref.close();
  }

  private toggleBlockUI(enabled: boolean) {
    if (enabled == true) {
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
