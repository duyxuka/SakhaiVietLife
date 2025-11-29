import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { forkJoin, Subject, takeUntil } from 'rxjs';

import { NotificationService } from 'src/app/shared/services/notification.service';
import { UtilityService } from 'src/app/shared/services/utility.service';

import { ValidationMessageComponent } from 'src/app/shared/modules/validation-message/validation-message.component';
import { StandaloneSharedModule } from '@/standaloneshare.module';

import { KhachHangDto } from '@/proxy/viet-life/business/khach-hangs-list/khach-hangs';
import { KhachHangsService, LoaiKhachHangsService } from '@/proxy/viet-life/business/khach-hangs';
import { ThanhPhosService } from '@/proxy/viet-life/business/thanh-phos';

@Component({
  selector: 'app-khachhang-detail',
  templateUrl: './khachhang-detail.component.html',
  standalone: true,
  imports: [StandaloneSharedModule, ValidationMessageComponent],
})
export class KhachHangDetailComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject<void>();

  form: FormGroup;
  selectedEntity = {} as KhachHangDto;

  blockedPanel = false;
  btnDisabled = false;

  loaiKhachHangOptions: any[] = [];
  thanhPhoOptions: any[] = [];

  constructor(
    private khService: KhachHangsService,
    private loaiKhService: LoaiKhachHangsService,
    private thanhPhoService: ThanhPhosService,
    private fb: FormBuilder,
    private config: DynamicDialogConfig,
    private ref: DynamicDialogRef,
    private utilService: UtilityService,
    private notificationService: NotificationService
  ) {}

  validationMessages = {
    maKhachHang: [{ type: 'required', message: 'Bạn phải nhập mã khách hàng' }],
    tenCongTy: [{ type: 'required', message: 'Bạn phải nhập tên công ty' }],
    tenKhachHang: [{ type: 'required', message: 'Bạn phải nhập tên khách hàng' }],
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
      maKhachHang: new FormControl(this.selectedEntity.maKhachHang || null, Validators.required),
      tenCongTy: new FormControl(this.selectedEntity.tenCongTy || null, Validators.required),
      tenKhachHang: new FormControl(this.selectedEntity.tenKhachHang || null, Validators.required),
      tenGiaoDich: new FormControl(this.selectedEntity.tenGiaoDich || null),
      dienThoai: new FormControl(this.selectedEntity.dienThoai || null),
      email: new FormControl(this.selectedEntity.email || null),
      diaChi: new FormControl(this.selectedEntity.diaChi || null),
      loaiKhachHangId: new FormControl(this.selectedEntity.loaiKhachHangId || null),
      thanhPhoId: new FormControl(this.selectedEntity.thanhPhoId || null),
      trangThai: new FormControl(this.selectedEntity.trangThai ?? true),
    });
  }
  initFormData() {
    this.toggleBlockUI(true);

    const loaiKhachHangList = this.loaiKhService.getListAll();
    const thanhPhoList = this.thanhPhoService.getListAll();

    forkJoin({
      loaiKhachHangList,
      thanhPhoList
    })
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (res: any) => {
          this.loaiKhachHangOptions = res.loaiKhachHangList.map((l: any) => ({
            value: l.id,
            label: l.ten
          }));
          this.thanhPhoOptions = res.thanhPhoList.map((tp: any) => ({
            value: tp.id,
            label: tp.ten
          }));

          if (this.utilService.isEmpty(this.config.data?.id)) {
            this.toggleBlockUI(false);
          } else {
            this.loadFormDetails(this.config.data.id);
          }
        },
        error: () => this.toggleBlockUI(false),
      });
  }
  loadFormDetails(id: string) {
    this.toggleBlockUI(true);

    this.khService
      .get(id)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (res) => {
          this.selectedEntity = res;
          this.buildForm();
          this.toggleBlockUI(false);
        },
        error: () => this.toggleBlockUI(false),
      });
  }
  saveChange() {
    this.toggleBlockUI(true);

    const request = this.utilService.isEmpty(this.config.data?.id)
      ? this.khService.create(this.form.value)
      : this.khService.update(this.config.data.id, this.form.value);

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
