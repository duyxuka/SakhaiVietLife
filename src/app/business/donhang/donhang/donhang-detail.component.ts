import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, forkJoin, takeUntil } from 'rxjs';
import { DonHangsService, LoaiDonHangsService } from '@/proxy/viet-life/business/don-hangs';
import { SanPhamsService } from '@/proxy/viet-life/business/san-phams';
import { UsersService } from '@/proxy/viet-life/system/users';
import { KhachHangsService } from '@/proxy/viet-life/business/khach-hangs';
import { BaoGiasService } from '@/proxy/viet-life/business/bao-gias';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { ValidationMessageComponent } from 'src/app/shared/modules/validation-message/validation-message.component';
import { StandaloneSharedModule } from '@/standaloneshare.module';

@Component({
  selector: 'app-donhang-detail',
  templateUrl: './donhang-detail.component.html',
  standalone: true,
  imports: [StandaloneSharedModule, ValidationMessageComponent]
})
export class DonHangDetailComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject<void>();

  form!: FormGroup;
  chiTietDonHangs!: FormArray;
  blockedPanel = false;
  btnDisabled = false;
  tongTien = 0;

  sanPhamOptions: any[] = [];
  nhanVienOptions: any[] = [];
  khachHangOptions: any[] = [];
  baoGiaOptions: any[] = [];
  loaiDonHangOptions: any[] = [];

  validationMessages = {
    maDonHang: [{ type: 'required', message: 'Bạn phải nhập mã đơn hàng' }]
  };

  constructor(
    private fb: FormBuilder,
    private donHangService: DonHangsService,
    private sanPhamService: SanPhamsService,
    private nhanVienService: UsersService,
    private khachHangService: KhachHangsService,
    private baoGiaService: BaoGiasService,
    private loaiDonHangService: LoaiDonHangsService,
    private config: DynamicDialogConfig,
    private ref: DynamicDialogRef,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.buildForm();
    this.loadDropdowns();

    if (this.config.data?.id) {
      this.loadData(this.config.data.id);
    }

    this.chiTietDonHangs = this.form.get('chiTietDonHangs') as FormArray;
    if (this.chiTietDonHangs.length === 0) this.addRow();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    this.ref?.close();
  }

  buildForm() {
    this.form = this.fb.group({
      maDonHang: [null, Validators.required],
      maDonHangGoc: [null],
      khachHangId: [null],
      loaiDonHangId: [null],
      ngayDatHang: [new Date()],
      nhanVienBanHangId: [null],
      nhanVienGiaoHangId: [null],
      baoGiaId: [null],
      tongTien: [{ value: 0, disabled: true }],
      chiTietDonHangs: this.fb.array([])
    });
    this.chiTietDonHangs = this.form.get('chiTietDonHangs') as FormArray;
  }

  newChiTiet(): FormGroup {
    return this.fb.group({
      sanPhamId: null,
      soLuong: 1,
      donGia: 0,
      chietKhau: 0,
      vat: 0
    });
  }

  addRow() {
    this.chiTietDonHangs.push(this.newChiTiet());
    this.calculateTotal();
  }

  removeRow(i: number) {
    this.chiTietDonHangs.removeAt(i);
    this.calculateTotal();
  }

  getThanhTien(row: FormGroup) {
    const soLuong = row.get('soLuong')?.value || 0;
    const donGia = row.get('donGia')?.value || 0;
    const chietKhau = row.get('chietKhau')?.value || 0;
    const vat = row.get('vat')?.value || 0;
    return soLuong * donGia * (1 - chietKhau / 100) * (1 + vat / 100);
  }

  calculateTotal() {
    this.tongTien = this.chiTietDonHangs.controls.reduce((sum, row) => {
      return sum + this.getThanhTien(row as FormGroup);
    }, 0);

    // Update formControl
    this.form.get('tongTien')?.setValue(this.tongTien);
  }

  loadDropdowns() {
    this.toggleBlockUI(true);

    forkJoin({
      sanPham: this.sanPhamService.getListAll(),
      nhanVien: this.nhanVienService.getListAll(''),
      khachHang: this.khachHangService.getListAll(),
      baoGia: this.baoGiaService.getListAll(),
      loaiDonHang: this.loaiDonHangService.getListAll()
    }).pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: res => {
          this.sanPhamOptions = res.sanPham.map(x => ({ value: x.id, label: x.ten }));
          this.nhanVienOptions = res.nhanVien.map(x => ({ value: x.id, label: x.name }));
          this.khachHangOptions = res.khachHang.map(x => ({ value: x.id, label: x.tenKhachHang }));
          this.baoGiaOptions = res.baoGia.map(x => ({ value: x.id, label: x.maBaoGia }));
          this.loaiDonHangOptions = res.loaiDonHang.map(x => ({ value: x.id, label: x.tenLoai }));
          this.toggleBlockUI(false);
        },
        error: () => this.toggleBlockUI(false)
      });
  }

  loadData(id: string) {
    this.toggleBlockUI(true);
    this.donHangService.get(id)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: res => {
          const data = {
            ...res,
            ngayDatHang: res.ngayDatHang ? new Date(res.ngayDatHang) : null
          };

          this.form.patchValue(data);

          this.chiTietDonHangs.clear();
          res.chiTietDonHangs?.forEach((ct: any) => {
            this.chiTietDonHangs.push(this.fb.group({
              sanPhamId: ct.sanPhamId || null,
              soLuong: ct.soLuong || 1,
              donGia: ct.donGia || 0,
              chietKhau: ct.chietKhau || 0,
              vat: ct.vat || 0
            }));
          });

          this.calculateTotal();
          this.toggleBlockUI(false);
        },
        error: () => this.toggleBlockUI(false)
      });
  }

  saveChange() {
    this.toggleBlockUI(true);

    const obs = this.config.data?.id
      ? this.donHangService.update(this.config.data.id, this.form.value)
      : this.donHangService.create(this.form.value);

    obs.pipe(takeUntil(this.ngUnsubscribe)).subscribe({
      next: () => {
        this.ref.close(true);
        this.toggleBlockUI(false);
      },
      error: err => {
        this.notificationService.showError(err.error?.error?.message || 'Lỗi hệ thống');
        this.toggleBlockUI(false);
      }
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
