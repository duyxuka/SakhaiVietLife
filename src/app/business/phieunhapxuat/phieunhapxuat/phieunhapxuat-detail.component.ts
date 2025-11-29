import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { forkJoin, Subject, takeUntil } from 'rxjs';
import { BaoGiasService } from '@/proxy/viet-life/business/bao-gias';
import { DonHangsService } from '@/proxy/viet-life/business/don-hangs';
import { KhoHangsService } from '@/proxy/viet-life/business/kho-hangs';
import { ChiTietPhieuNhapXuatsService, LoaiNhapXuatsService, PhieuNhapXuatsService } from '@/proxy/viet-life/business/nhap-xuats';
import { SanPhamsService } from '@/proxy/viet-life/business/san-phams';
import { UsersService } from '@/proxy/viet-life/system/users';
import { StandaloneSharedModule } from '@/standaloneshare.module';
import { ValidationMessageComponent } from 'src/app/shared/modules/validation-message/validation-message.component';
import { NotificationService } from 'src/app/shared/services/notification.service';

@Component({
    selector: 'app-phieu-nhap-xuat-detail',
    templateUrl: './phieunhapxuat-detail.component.html',
    standalone: true,
    imports: [StandaloneSharedModule, ValidationMessageComponent]
})
export class PhieuNhapXuatDetailComponent implements OnInit, OnDestroy {

    private ngUnsubscribe = new Subject<void>();
    blockedPanel = false;
    btnDisabled = false;

    form!: FormGroup;
    chiTietList!: FormArray;

    selectedEntity: any = {};

    // Dropdown data
    loaiNXOptions: any[] = [];
    khoOptions: any[] = [];
    sanPhamOptions: any[] = [];
    donHangOptions: any[] = [];
    baoGiaOptions: any[] = [];
    nhanVienOptions: any[] = [];

    validationMessages = {
        maPhieu: [{ type: 'required', message: 'Bạn phải nhập mã phiếu' }],
        loaiNhapXuatId: [{ type: 'required', message: 'Bạn phải chọn loại phiếu' }]
    };

    constructor(
        private fb: FormBuilder,
        private service: PhieuNhapXuatsService,
        private ctService: ChiTietPhieuNhapXuatsService,
        private loaiNXService: LoaiNhapXuatsService,
        private khoService: KhoHangsService,
        private sanPhamService: SanPhamsService,
        private donHangService: DonHangsService,
        private baoGiaService: BaoGiasService,
        private nhanVienService: UsersService,
        private config: DynamicDialogConfig,
        private ref: DynamicDialogRef,
        private notificationService: NotificationService
    ) { }

    ngOnInit(): void {
        this.buildForm();
        this.loadDropdowns();

        if (this.config.data?.id) {
            this.loadData(this.config.data.id);
        } else if (this.chiTietPhieu.length === 0) {
            this.addRow();
        }
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    buildForm() {
        this.form = this.fb.group({
            maPhieu: [null, Validators.required],
            loaiNhapXuatId: [null, Validators.required],
            khoId: [null],
            khoDenId: [null],
            donHangId: [null],
            baoGiaId: [null],
            nhanVienLapId: [null],
            ngayLap: [new Date()],
            chiTietList: this.fb.array([])
        });
        this.chiTietList = this.form.get('chiTietList') as FormArray;
    }

    get chiTietPhieu(): FormArray {
        return this.form.get('chiTietList') as FormArray;
    }

    newChiTiet(item?: any): FormGroup {
        return this.fb.group({
            id: [item?.id || '00000000-0000-0000-0000-000000000000'], // Guid.Empty cho chi tiết mới
            sanPhamId: [item?.sanPhamId || null, Validators.required],
            soLuong: [item?.soLuong ?? 1, [Validators.required, Validators.min(1)]],
            donGia: [item?.donGia ?? 0, [Validators.required, Validators.min(0)]],
            chietKhau: [item?.chietKhau ?? 0],
            vat: [item?.vat ?? 0],
            giaVon: [item?.giaVon ?? 0]
        });
    }

    addRow(item?: any) {
        this.chiTietPhieu.push(this.newChiTiet(item));
    }

    removeRow(i: number) {
        this.chiTietPhieu.removeAt(i);
    }

    loadDropdowns() {
        this.toggleBlockUI(true);

        forkJoin({
            loaiNX: this.loaiNXService.getListAll(),
            kho: this.khoService.getListAll(),
            sanPham: this.sanPhamService.getListAll(),
            donHang: this.donHangService.getListAll(),
            baoGia: this.baoGiaService.getListAll(),
            nhanVien: this.nhanVienService.getListAll('')
        }).pipe(takeUntil(this.ngUnsubscribe))
            .subscribe({
                next: res => {
                    this.loaiNXOptions = res.loaiNX.map((x: any) => ({ label: x.tenLoai, value: x.id }));
                    this.khoOptions = res.kho.map((x: any) => ({ label: x.tenKho, value: x.id }));
                    this.sanPhamOptions = res.sanPham.map((x: any) => ({ label: x.ten, value: x.id }));
                    this.donHangOptions = res.donHang.map((x: any) => ({ label: x.maDonHang, value: x.id }));
                    this.baoGiaOptions = res.baoGia.map((x: any) => ({ label: x.tieuDe, value: x.id }));
                    this.nhanVienOptions = res.nhanVien.map((x: any) => ({ label: x.name, value: x.id }));
                    this.toggleBlockUI(false);
                },
                error: () => this.toggleBlockUI(false)
            });
    }

    loadData(id: string) {
        this.toggleBlockUI(true);
        this.service.get(id).pipe(takeUntil(this.ngUnsubscribe)).subscribe({
            next: (res: any) => {
                this.selectedEntity = res;

                this.form.patchValue({
                    maPhieu: res.maPhieu,
                    loaiNhapXuatId: res.loaiNhapXuatId,
                    khoId: res.khoId,
                    khoDenId: res.khoDenId,
                    donHangId: res.donHangId,
                    baoGiaId: res.baoGiaId,
                    nhanVienLapId: res.nhanVienLapId,
                    ngayLap: res.ngayLap ? new Date(res.ngayLap) : null
                });

                // Clear & load chi tiết
                this.chiTietPhieu.clear();
                res.chiTietPhieuNhapXuats?.forEach((item: any) => this.addRow(item));

                this.toggleBlockUI(false);
            },
            error: () => this.toggleBlockUI(false)
        });
    }

    saveChange() {
        if (this.form.invalid) return;

        const validChiTiet = this.chiTietPhieu.controls
            .filter(ct => ct.value.sanPhamId)
            .map(ct => {
                const v = ct.value;
                return {
                    id: v.id,
                    sanPhamId: v.sanPhamId,
                    soLuong: v.soLuong,
                    donGia: v.donGia,
                    chietKhau: v.chietKhau,
                    vat: v.vat,
                    giaVon: v.giaVon
                };
            });

        if (validChiTiet.length === 0) {
            this.notificationService.showError('Bạn phải nhập ít nhất 1 chi tiết phiếu');
            return;
        }

        const { chiTietList, ...formData } = this.form.value;
        const input = { ...formData, ChiTietPhieuNhapXuats: validChiTiet };

        this.toggleBlockUI(true);
        const obs = this.config.data?.id
            ? this.service.update(this.config.data.id, input)
            : this.service.create(input);

        obs.pipe(takeUntil(this.ngUnsubscribe)).subscribe({
            next: () => {
                this.toggleBlockUI(false);
                this.ref.close(true);
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
            }, 500);
        }
    }
}
