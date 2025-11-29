import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, forkJoin, takeUntil } from 'rxjs';

import { NotificationService } from 'src/app/shared/services/notification.service';
import { UtilityService } from 'src/app/shared/services/utility.service';

import { ValidationMessageComponent } from 'src/app/shared/modules/validation-message/validation-message.component';
import { StandaloneSharedModule } from '@/standaloneshare.module';

import { ThuChiDto } from '@/proxy/viet-life/business/thu-chis-list/thu-chis';
import { PaymentMethod, ThuChiStatus, DoiTuongType } from '@/proxy/viet-life/thu-chis';
import { LoaiThuChisService, TaiKhoanKeToansService, ThuChisService } from '@/proxy/viet-life/business/thu-chis';
import { KhachHangsService } from '@/proxy/viet-life/business/khach-hangs';
import { UsersService } from '@/proxy/viet-life/system/users';

@Component({
    selector: 'app-thuchi-detail',
    standalone: true,
    templateUrl: './thuchi-detail.component.html',
    imports: [StandaloneSharedModule, ValidationMessageComponent],
})
export class ThuChiDetailComponent implements OnInit, OnDestroy {
    private ngUnsubscribe = new Subject<void>();

    form: FormGroup;
    selectedEntity = {} as ThuChiDto;

    blockedPanel = false;
    btnDisabled = false;

    loaiThuChis: any[] = [];
    taiKhoans: any[] = [];
    doiTuongOptions: any[] = []; // customers / partners
    nguoiDuyetOptions: any[] = [];

    paymentMethods = [
        { label: 'Tiền mặt', value: PaymentMethod.TienMat },
        { label: 'Chuyển khoản', value: PaymentMethod.ChuyenKhoan },
        { label: 'POS', value: PaymentMethod.POS },
    ];

    // map status (adjust labels to your language)
    statusOptions = [
        { label: 'Chờ duyệt', value: ThuChiStatus.ChoDuyet },
        { label: 'Đã duyệt', value: ThuChiStatus.DaDuyet },
        { label: 'Hủy', value: ThuChiStatus.Huy },
    ];

    // DoiTuongType options (adjust names if your enum differs)
    doiTuongTypeOptions = [
        { label: 'Khách hàng', value: DoiTuongType.KhachHang },
        { label: 'Nhà cung cấp', value: DoiTuongType.NhaCungCap },
        { label: 'Nhân viên', value: DoiTuongType.NhanVien },
        { label: 'Khác', value: DoiTuongType.Khac },
    ];

    constructor(
        private fb: FormBuilder,
        private thuchiService: ThuChisService,
        private loaiThuChiService: LoaiThuChisService,
        private taiKhoanService: TaiKhoanKeToansService,
        private khachHangService: KhachHangsService,
        private nhanVienService: UsersService,
        private ref: DynamicDialogRef,
        private config: DynamicDialogConfig,
        private utilService: UtilityService,
        private notificationService: NotificationService
    ) { }

    validationMessages = {
        maPhieu: [{ type: 'required', message: 'Bạn phải nhập mã phiếu' }],
        soTien: [{ type: 'required', message: 'Số tiền không được để trống' }],
        ngayGiaoDich: [{ type: 'required', message: 'Bạn phải chọn ngày giao dịch' }],
    };

    ngOnInit(): void {
        this.buildForm();
        this.loadMasterData();
        this.initFormData();
    }

    ngOnDestroy(): void {
        this.ref?.close();
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    buildForm() {
        this.form = this.fb.group({
            maPhieu: new FormControl(this.selectedEntity.maPhieu || null, Validators.required),
            ngayGiaoDich: new FormControl(
                this.selectedEntity.ngayGiaoDich ? new Date(this.selectedEntity.ngayGiaoDich) : null,
                Validators.required
            ),
            ngayHachToan: new FormControl(
                this.selectedEntity.ngayHachToan ? new Date(this.selectedEntity.ngayHachToan) : null
            ),
            dienGiai: new FormControl(this.selectedEntity.dienGiai || null),

            soTien: new FormControl(this.selectedEntity.soTien || 0, Validators.required),

            loaiThuChiId: new FormControl(this.selectedEntity.loaiThuChiId || null),
            taiKhoanNoId: new FormControl(this.selectedEntity.taiKhoanNoId || null),
            taiKhoanCoId: new FormControl(this.selectedEntity.taiKhoanCoId || null),

            loaiDoiTuong: new FormControl(this.selectedEntity.loaiDoiTuong || null),
            doiTuongId: new FormControl(this.selectedEntity.doiTuongId || null),

            phuongThucThanhToan: new FormControl(this.selectedEntity.phuongThucThanhToan || PaymentMethod.TienMat),
            soTaiKhoanNganHang: new FormControl(this.selectedEntity.soTaiKhoanNganHang || null),
            tenNganHang: new FormControl(this.selectedEntity.tenNganHang || null),

            soHoaDon: new FormControl(this.selectedEntity.soHoaDon || null),
            ngayHoaDon: new FormControl(
                this.selectedEntity.ngayHoaDon ? new Date(this.selectedEntity.ngayHoaDon) : null
            ),
            thueSuat: new FormControl(this.selectedEntity.thueSuat || null),
            tienThue: new FormControl(this.selectedEntity.tienThue || null),
            thanhTienSauThue: new FormControl(this.selectedEntity.thanhTienSauThue || null),

            status: new FormControl(this.selectedEntity.status || ThuChiStatus.ChoDuyet),
            nguoiDuyetId: new FormControl(this.selectedEntity.nguoiDuyetId || null),
            ngayDuyet: new FormControl(
                this.selectedEntity.ngayDuyet ? new Date(this.selectedEntity.ngayDuyet) : null
            ),

            lyDoHuy: new FormControl(this.selectedEntity.lyDoHuy || null),
        });

        // Lắng nghe thay đổi LoaiDoiTuong để load đối tượng
        this.form.get('loaiDoiTuong')?.valueChanges.subscribe(value => {
            this.loadDoiTuongOptions(value);
            this.form.get('doiTuongId')?.setValue(null); // reset khi đổi loại
        });
    }

    initFormData() {
        if (this.utilService.isEmpty(this.config.data?.id)) return;

        this.toggleBlockUI(true);
        this.thuchiService.get(this.config.data.id)
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe({
                next: res => {
                    this.selectedEntity = res;
                    this.buildForm();
                    if (this.selectedEntity.loaiDoiTuong != null) {
                        this.loadDoiTuongOptions(this.selectedEntity.loaiDoiTuong, this.selectedEntity.doiTuongId);
                    }
                    this.toggleBlockUI(false);
                },
                error: () => this.toggleBlockUI(false),
            });
    }

    loadMasterData() {
        this.toggleBlockUI(true);

        forkJoin({
            loaiThuChis: this.loaiThuChiService.getListAll(),
            taiKhoans: this.taiKhoanService.getListAll(),
            nguoiDuyets: this.nhanVienService.getListAll('')
        }).pipe(takeUntil(this.ngUnsubscribe)).subscribe({
            next: res => {
                this.loaiThuChis = res.loaiThuChis.map((x: any) => ({ value: x.id, label: x.ten }));
                console.log(this.loaiThuChis)
                this.taiKhoans = res.taiKhoans.map((x: any) => ({ value: x.id, label: x.soTaiKhoan + ' - ' + x.tenTaiKhoan }));
                this.nguoiDuyetOptions = res.nguoiDuyets.map((x: any) => ({ value: x.id, label: x.name }));
                this.toggleBlockUI(false);
            },
            error: () => this.toggleBlockUI(false),
        });
    }

    loadDoiTuongOptions(type: DoiTuongType, selectedId?: string) {
        this.doiTuongOptions = [];
        this.toggleBlockUI(true);

        let obs;
        switch (type) {
            case DoiTuongType.KhachHang:
                obs = this.khachHangService.getListAll();
                break;
            case DoiTuongType.NhaCungCap:
                obs = null;
                break;
            case DoiTuongType.NhanVien:
                obs = this.nhanVienService.getListAll('');
                break;
            default:
                obs = null;
        }

        if (obs) {
            obs.pipe(takeUntil(this.ngUnsubscribe)).subscribe({
                next: (res: any[]) => {
                    this.doiTuongOptions = res.map(x => ({ value: x.id, label: x.name || x.tenKhachHang }));
                    if (selectedId) {
                        this.form.get('doiTuongId')?.setValue(selectedId);
                    }
                    this.toggleBlockUI(false);
                },
                error: () => this.toggleBlockUI(false),
            });
        } else {
            this.toggleBlockUI(false);
        }
    }

    saveChange() {
        this.toggleBlockUI(true);

        const request = this.config.data?.id
            ? this.thuchiService.update(this.config.data.id, this.form.value)
            : this.thuchiService.create(this.form.value);

        request.pipe(takeUntil(this.ngUnsubscribe)).subscribe({
            next: () => {
                this.toggleBlockUI(false);
                this.ref.close(this.form.value);
            },
            error: err => {
                this.notificationService.showError(err.error?.error?.message || 'Lỗi khi lưu phiếu');
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
            }, 800);
        }
    }
}