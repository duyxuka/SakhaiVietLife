import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, forkJoin, takeUntil } from 'rxjs';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { ValidationMessageComponent } from 'src/app/shared/modules/validation-message/validation-message.component';
import { StandaloneSharedModule } from '@/standaloneshare.module';

import {
  HopDongNhanVienDto,
} from '@/proxy/viet-life/catalog/hop-dongs/hop-dong-nhan-viens';

import {
  UserInListDto,
  UsersService
} from '@/proxy/viet-life/system/users';

import {
  LoaiHopDongInListDto,
} from '@/proxy/viet-life/catalog/hop-dongs/loai-hop-dongs';
import { HopDongNhanViensService, LoaiHopDongsService } from '@/proxy/viet-life/catalog/hop-dongs';

@Component({
  selector: 'app-hop-dong-nhan-vien-detail',
  templateUrl: './hopdongnhanvien-detail.component.html',
  standalone: true,
  imports: [
    StandaloneSharedModule,
    ValidationMessageComponent
  ]
})
export class HopDongNhanVienDetailComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject<void>();

  blockedPanel = false;
  btnDisabled = false;

  form: FormGroup;
  selectedEntity = {} as HopDongNhanVienDto;

  nhanVienOptions: any[] = [];
  loaiHopDongOptions: any[] = [];

  trangThaiOptions = ['Chờ duyệt', 'Đã duyệt', 'Từ chối', 'Hết hạn'];

  validationMessages = {
    nhanVienId: [{ type: 'required', message: 'Bạn phải chọn nhân viên' }],
    loaiHopDongId: [{ type: 'required', message: 'Bạn phải chọn loại hợp đồng' }],
    maHopDong: [{ type: 'required', message: 'Bạn phải nhập mã hợp đồng' }],
    ngayKy: [{ type: 'required', message: 'Bạn phải chọn ngày ký' }],
    ngayHieuLuc: [{ type: 'required', message: 'Bạn phải chọn ngày hiệu lực' }],
  };

  constructor(
    private fb: FormBuilder,
    private hopDongService: HopDongNhanViensService,
    private loaiHopDongService: LoaiHopDongsService,
    private nhanVienService: UsersService,
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
    if (this.ref) {
      this.ref.close();
    }
  }

  // --------------------------------------
  // BUILD FORM
  // --------------------------------------
  private buildForm() {
    this.form = this.fb.group({
      nhanVienId: new FormControl(this.selectedEntity.nhanVienId || null, Validators.required),
      loaiHopDongId: new FormControl(this.selectedEntity.loaiHopDongId || null, Validators.required),
      maHopDong: new FormControl(this.selectedEntity.maHopDong || null, Validators.required),
      ngayKy: new FormControl(
        this.selectedEntity.ngayKy ? new Date(this.selectedEntity.ngayKy) : null,
        Validators.required
      ),
      ngayHieuLuc: new FormControl(
        this.selectedEntity.ngayHieuLuc ? new Date(this.selectedEntity.ngayHieuLuc) : null,
        Validators.required
      ),
      ngayHetHan: new FormControl(
        this.selectedEntity.ngayHetHan ? new Date(this.selectedEntity.ngayHetHan) : null
      ),
      soThang: new FormControl(this.selectedEntity.soThang || null),
      luongCoBan: new FormControl(this.selectedEntity.luongCoBan || null),
      donGiaCong: new FormControl(this.selectedEntity.donGiaCong || null),
      trangThai: new FormControl(this.selectedEntity.trangThai || 'Chờ duyệt'),
      nguoiDuyetId: new FormControl(this.selectedEntity.nguoiDuyetId || null),
      ngayDuyet: new FormControl(
        this.selectedEntity.ngayDuyet ? new Date(this.selectedEntity.ngayDuyet) : null
      ),
      ghiChu: new FormControl(this.selectedEntity.ghiChu || null),
      laHienHanh: new FormControl(this.selectedEntity.laHienHanh || false),
    });
  }

  // --------------------------------------
  // INIT DATA
  // --------------------------------------
  initFormData() {
    const nhanVienOptions = this.nhanVienService.getListAll('');
    const loaiHopDongOptions = this.loaiHopDongService.getListAll();

    this.toggleBlockUI(true);

    forkJoin({
      nhanVienOptions,
      loaiHopDongOptions
    })
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: response => {
          this.nhanVienOptions = (response.nhanVienOptions as UserInListDto[]).map(x => ({
            value: x.id,
            label: x.name
          }));

          this.loaiHopDongOptions = (response.loaiHopDongOptions as LoaiHopDongInListDto[]).map(x => ({
            value: x.id,
            label: x.tenLoai
          }));

          if (this.utilService.isEmpty(this.config.data?.id)) {
            this.toggleBlockUI(false);
          } else {
            this.loadFormDetails(this.config.data?.id);
          }
        },
        error: () => {
          this.toggleBlockUI(false);
        }
      });
  }

  // --------------------------------------
  // LOAD FORM DETAILS
  // --------------------------------------
  private loadFormDetails(id: string) {
    this.toggleBlockUI(true);

    this.hopDongService.get(id)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: res => {
          this.selectedEntity = res;
          this.buildForm();
          this.toggleBlockUI(false);
        },
        error: () => {
          this.toggleBlockUI(false);
        }
      });
  }

  // --------------------------------------
  // SAVE
  // --------------------------------------
  saveChange() {
    this.toggleBlockUI(true);

    const obs = this.utilService.isEmpty(this.config.data?.id)
      ? this.hopDongService.create(this.form.value)
      : this.hopDongService.update(this.config.data.id, this.form.value);

    obs.pipe(takeUntil(this.ngUnsubscribe)).subscribe({
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

  // --------------------------------------
  // BLOCK UI
  // --------------------------------------
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
