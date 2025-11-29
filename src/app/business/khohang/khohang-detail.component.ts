import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, forkJoin, takeUntil } from 'rxjs';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { KhoHangDto, KhoHangsService } from '@proxy/viet-life/business/kho-hangs';
import { ThanhPhoInListDto, ThanhPhosService } from '@proxy/viet-life/business/thanh-phos';
import { StandaloneSharedModule } from '../../standaloneshare.module';
import { ValidationMessageComponent } from 'src/app/shared/modules/validation-message/validation-message.component';

@Component({
  selector: 'app-kho-hang-detail',
  templateUrl: './khohang-detail.component.html',
  standalone: true,
  imports: [StandaloneSharedModule, ValidationMessageComponent]
})
export class KhoHangDetailComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject<void>();
  blockedPanel = false;
  btnDisabled = false;
  form: FormGroup;
  selectedEntity = {} as KhoHangDto;
  thanhPhoList: any[] = [];

  validationMessages = {
    tenKho: [
      { type: 'required', message: 'Bạn phải nhập tên kho' },
      { type: 'maxlength', message: 'Tên kho không được quá 255 ký tự' }
    ],
    thanhPhoId: [
      { type: 'required', message: 'Bạn phải chọn thành phố' }
    ],
    diaChi: [
      { type: 'required', message: 'Bạn phải nhập địa chỉ' }
    ]
  };

  constructor(
    private khoHangService: KhoHangsService,
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

    const thanhPhoObs = this.thanhPhoService.getListAll();

    forkJoin({ thanhPhoObs })
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (res: any) => {
          const list = res.thanhPhoObs as ThanhPhoInListDto[];
          this.thanhPhoList = list.map(x => ({
            label: x.ten,
            value: x.id
          }));

          if (this.utilService.isEmpty(this.config.data?.id)) {
            this.toggleBlockUI(false);
          } else {
            this.loadFormDetails(this.config.data.id);
          }
        },
        error: () => this.toggleBlockUI(false)
      });
  }

  loadFormDetails(id: string) {
    this.toggleBlockUI(true);
    this.khoHangService.get(id)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (res: KhoHangDto) => {
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
      ? this.khoHangService.create(this.form.value)
      : this.khoHangService.update(this.config.data.id, this.form.value);

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
      tenKho: new FormControl(this.selectedEntity.tenKho || null, [Validators.required, Validators.maxLength(255)]),
      diaChi: new FormControl(this.selectedEntity.diaChi || null,Validators.required),
      thanhPhoId: new FormControl(this.selectedEntity.thanhPhoId || null, Validators.required)
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