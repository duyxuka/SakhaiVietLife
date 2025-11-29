import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { ThanhPhoDto, ThanhPhosService } from '@proxy/viet-life/business/thanh-phos';
import { StandaloneSharedModule } from '../../standaloneshare.module';
import { ValidationMessageComponent } from 'src/app/shared/modules/validation-message/validation-message.component';

@Component({
  selector: 'app-thanh-pho-detail',
  templateUrl: './thanhpho-detail.component.html',
  standalone: true,
  imports: [StandaloneSharedModule, ValidationMessageComponent]
})
export class ThanhPhoDetailComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject<void>();
  blockedPanel = false;
  btnDisabled = false;
  form: FormGroup;
  selectedEntity = {} as ThanhPhoDto;

  validationMessages = {
    ten: [
      { type: 'required', message: 'Bạn phải nhập tên thành phố' },
      { type: 'maxlength', message: 'Tên không được quá 255 ký tự' }
    ],
    maVung: [
      { type: 'required', message: 'Bạn phải nhập mã vùng' },
      { type: 'maxlength', message: 'Mã vùng không được quá 10 ký tự' },
      { type: 'pattern', message: 'Mã vùng chỉ được chứa chữ cái in hoa và số' }
    ]
  };

  constructor(
    private thanhPhoService: ThanhPhosService,
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
    //Load edit data to form
    if (this.utilService.isEmpty(this.config.data?.id) == true) {
      this.toggleBlockUI(false);
    } else {
      this.loadFormDetails(this.config.data?.id);
    }
  }

  loadFormDetails(id: string) {
    this.toggleBlockUI(true);
    this.thanhPhoService.get(id)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (res: ThanhPhoDto) => {
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
      ? this.thanhPhoService.create(this.form.value)
      : this.thanhPhoService.update(this.config.data.id, this.form.value);

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
      ten: new FormControl(
        this.selectedEntity.ten || null,
        [Validators.required, Validators.maxLength(255)]
      ),
      maVung: new FormControl(
        this.selectedEntity.maVung || null,
        [
          Validators.required,
          Validators.maxLength(10),
          Validators.pattern(/^[A-Z0-9]+$/)
        ]
      )
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