import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { ValidationMessageComponent } from 'src/app/shared/modules/validation-message/validation-message.component';
import { StandaloneSharedModule } from '@/standaloneshare.module';
import { LoaiNhapXuatDto } from '@/proxy/viet-life/business/nhap-xuats/loai-nhap-xuats';
import { LoaiNhapXuatsService } from '@/proxy/viet-life/business/nhap-xuats';

@Component({
    selector: 'app-loai-nhap-xuat-detail',
    templateUrl: './loainhapxuat-detail.component.html',
    standalone: true,
    imports: [StandaloneSharedModule, ValidationMessageComponent]
})
export class LoaiNhapXuatDetailComponent implements OnInit, OnDestroy {

    private ngUnsubscribe = new Subject<void>();
    form: FormGroup;
    blockedPanel = false;
    btnDisabled = false;

    selectedEntity = {} as LoaiNhapXuatDto;

    kieuOptions = [
        { label: 'Nhập', value: 1 },
        { label: 'Xuất', value: 2 },
        { label: 'Chuyển kho', value: 3 },
        { label: 'Điều chỉnh', value: 4 }
    ];

    tangGiamOptions = [
        { label: 'Tăng tồn', value: true },
        { label: 'Giảm tồn', value: false }
    ];

    validationMessages = {
        tenLoai: [{ type: 'required', message: 'Bạn phải nhập tên loại' }],
        kieuNhapXuat: [{ type: 'required', message: 'Bạn phải chọn kiểu nhập xuất' }],
        tangGiamTon: [{ type: 'required', message: 'Bạn phải chọn tăng/giảm tồn' }]
    };

    constructor(
        private service: LoaiNhapXuatsService,
        private fb: FormBuilder,
        private config: DynamicDialogConfig,
        private ref: DynamicDialogRef,
        private utilService: UtilityService,
        private notificationService: NotificationService
    ) { }

    ngOnInit(): void {
        this.buildForm();
        this.initFormData();
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
        this.ref?.close();
    }

    buildForm() {
        this.form = this.fb.group({
            tenLoai: new FormControl(this.selectedEntity.tenLoai || null, Validators.required),
            kieuNhapXuat: new FormControl(this.selectedEntity.kieuNhapXuat || null, Validators.required),
            tangGiamTon: new FormControl(this.selectedEntity.tangGiamTon ?? null, Validators.required)
        });
    }

    initFormData() {
        this.toggleBlockUI(true);
        if (!this.config.data?.id) {
            this.toggleBlockUI(false);
        } else {
            this.service.get(this.config.data.id)
                .pipe(takeUntil(this.ngUnsubscribe))
                .subscribe({
                    next: res => {
                        this.selectedEntity = res;
                        this.buildForm();
                        this.toggleBlockUI(false);
                    },
                    error: () => this.toggleBlockUI(false)
                });
        }
    }

    saveChange() {
        this.toggleBlockUI(true);

        const isNew = this.utilService.isEmpty(this.config.data?.id);

        const obs = isNew
            ? this.service.create(this.form.value)
            : this.service.update(this.config.data.id, this.form.value);

        obs.pipe(takeUntil(this.ngUnsubscribe))
            .subscribe({
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

    toggleBlockUI(enabled: boolean) {
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
        this.ref.close();
    }
}
