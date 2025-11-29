import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, forkJoin, takeUntil } from 'rxjs';
import { BaoGiasService } from '@/proxy/viet-life/business/bao-gias';
import { SanPhamsService } from '@/proxy/viet-life/business/san-phams';
import { UsersService } from '@/proxy/viet-life/system/users';
import { KhachHangsService } from '@/proxy/viet-life/business/khach-hangs';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { StandaloneSharedModule } from '@/standaloneshare.module';
import { ValidationMessageComponent } from 'src/app/shared/modules/validation-message/validation-message.component';
import { TienTesService } from '@/proxy/viet-life/business/tien-tes';

@Component({
    selector: 'app-bao-gia-detail',
    templateUrl: './baogia-detail.component.html',
    standalone: true,
    imports: [StandaloneSharedModule, ValidationMessageComponent]
})
export class BaoGiaDetailComponent implements OnInit, OnDestroy {

    private ngUnsubscribe = new Subject<void>();
    blockedPanel = false;
    btnDisabled = false;

    form!: FormGroup;

    khachHangOptions: any[] = [];
    sanPhamOptions: any[] = [];
    nhanVienOptions: any[] = [];
    tienTeOptions: any[] = [];
    selectedEntity: any = {};

    validationMessages = {
        maBaoGia: [{ type: 'required', message: 'Bạn phải nhập mã báo giá' }]
    };

    constructor(
        private fb: FormBuilder,
        private baoGiaService: BaoGiasService,
        private sanPhamService: SanPhamsService,
        private nhanVienService: UsersService,
        private khachhangService: KhachHangsService,
        private tienteService: TienTesService,
        private config: DynamicDialogConfig,
        private ref: DynamicDialogRef,
        private notificationService: NotificationService
    ) { }

    ngOnInit(): void {
        this.buildForm();
        this.loadDropdowns();

        if (this.config.data?.id) {
            this.loadData(this.config.data.id);
        } else if (this.chiTietBaoGias.length === 0) {
            this.addRow();
        }
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    buildForm() {
        this.form = this.fb.group({
            maBaoGia: [null, Validators.required],
            tieuDe: [null],
            khachHangId: [null],
            nhanVienId: [null],
            ngayBaoGia: [new Date()],
            ngayHetHan: [null],
            tongTien: [0],
            chietKhau: [0],
            vat: [0],
            tienTeId: [null],
            daChuyenDonHang: [false],
            chiTietBaoGias: this.fb.array([])
        });
    }

    get chiTietBaoGias(): FormArray {
        return this.form.get('chiTietBaoGias') as FormArray;
    }

    newChiTiet(item?: any): FormGroup {
        return this.fb.group({
            id: [item?.id || null],
            sanPhamId: [item?.sanPhamId || null, Validators.required],
            soLuong: [item?.soLuong ?? 1, [Validators.required, Validators.min(1)]],
            donGia: [item?.donGia ?? 0, [Validators.required, Validators.min(0)]],
            chietKhau: [item?.chietKhau ?? 0]
        });
    }

    addRow(item?: any) {
        this.chiTietBaoGias.push(this.newChiTiet(item));
    }

    removeRow(i: number) {
        this.chiTietBaoGias.removeAt(i);
    }

    calculateThanhTien(row: FormGroup) {
        const sl = row.get('soLuong')?.value || 0;
        const dg = row.get('donGia')?.value || 0;
        const ck = row.get('chietKhau')?.value || 0;
        return sl * dg * (1 - ck / 100);
    }

    getTongTien() {
        return this.chiTietBaoGias.controls.reduce((sum, row) =>
            sum + this.calculateThanhTien(row as FormGroup), 0);
    }
    loadDropdowns() {
        this.toggleBlockUI(true);
        forkJoin({
            sanPham: this.sanPhamService.getListAll(),
            nhanVien: this.nhanVienService.getListAll(''),
            khachHang: this.khachhangService.getListAll(),
            tienTe: this.tienteService.getListAll()
        })
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe({
                next: res => {
                    this.sanPhamOptions = res.sanPham.map((x: any) => ({ label: x.ten, value: x.id }));
                    this.nhanVienOptions = res.nhanVien.map((x: any) => ({ label: x.name, value: x.id }));
                    this.khachHangOptions = res.khachHang.map((x: any) => ({ label: x.tenCongTy, value: x.id }));
                    this.tienTeOptions = res.tienTe.map((x: any) => ({ label: x.tenTienTe, value: x.id }));
                    this.toggleBlockUI(false);
                },
                error: () => this.toggleBlockUI(false)
            });
    }

    loadData(id: string) {
        this.toggleBlockUI(true);
        this.baoGiaService.get(id)
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe({
                next: (res: any) => {
                    this.selectedEntity = res;

                    this.form.patchValue({
                        maBaoGia: res.maBaoGia,
                        tieuDe: res.tieuDe,
                        khachHangId: res.khachHangId,
                        nhanVienId: res.nhanVienId,
                        ngayBaoGia: res.ngayBaoGia ? new Date(res.ngayBaoGia) : null,
                        ngayHetHan: res.ngayHetHan ? new Date(res.ngayHetHan) : null,

                        tongTien: res.tongTien,
                        chietKhau: res.chietKhau,
                        vat: res.vat,
                        tienTeId: res.tienTeId,
                        daChuyenDonHang: res.daChuyenDonHang,
                    });

                    this.chiTietBaoGias.clear();
                    res.chiTietBaoGias?.forEach((item: any) => this.addRow(item));

                    this.toggleBlockUI(false);
                },
                error: () => this.toggleBlockUI(false)
            });
    }

    saveChange() {
        if (this.form.invalid) return;

        const validChiTiet = this.chiTietBaoGias.controls
            .filter(ct => ct.value.sanPhamId)
            .map(ct => ct.value);

        if (validChiTiet.length === 0) {
            this.notificationService.showError('Bạn phải nhập ít nhất 1 chi tiết báo giá');
            return;
        }

        const { chiTietBaoGias, ...formData } = this.form.value;

        const input = {
            ...formData,
            tongTien: this.getTongTien(),
            chiTietBaoGias: validChiTiet
        };

        this.toggleBlockUI(true);

        const obs = this.config.data?.id
            ? this.baoGiaService.update(this.config.data.id, input)
            : this.baoGiaService.create(input);

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
        if (enabled === true) {
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
