import { Component, OnDestroy, OnInit } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { ConfirmationService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';

import { NotificationService } from 'src/app/shared/services/notification.service';

import { LoaiNhapXuatDetailComponent } from './loainhapxuat-detail.component';
import { StandaloneSharedModule } from '@/standaloneshare.module';
import { LoaiNhapXuatInListDto } from '@/proxy/viet-life/business/nhap-xuats/loai-nhap-xuats';
import { LoaiNhapXuatsService } from '@/proxy/viet-life/business/nhap-xuats';

@Component({
    selector: 'app-loai-nhap-xuat',
    templateUrl: './loainhapxuat.component.html',
    standalone: true,
    imports: [StandaloneSharedModule]
})
export class LoaiNhapXuatComponent implements OnInit, OnDestroy {

    private ngUnsubscribe = new Subject<void>();
    blockedPanel = false;

    items: LoaiNhapXuatInListDto[] = [];
    selectedItems: LoaiNhapXuatInListDto[] = [];
    keyword = '';

    skipCount = 0;
    maxResultCount = 10;
    totalCount = 0;

    constructor(
        private service: LoaiNhapXuatsService,
        private dialogService: DialogService,
        private notification: NotificationService,
        private confirm: ConfirmationService
    ) { }

    ngOnInit() {
        this.loadData();
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    loadData() {
        this.toggleBlockUI(true);

        this.service.getListFilter({
            keyword: this.keyword,
            skipCount: this.skipCount,
            maxResultCount: this.maxResultCount
        })
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe({
                next: res => {
                    this.items = res.items;
                    this.totalCount = res.totalCount;
                    this.toggleBlockUI(false);
                },
                error: () => this.toggleBlockUI(false)
            });
    }

    pageChanged(e: any) {
        this.skipCount = e.first;
        this.maxResultCount = e.rows;
        this.loadData();
    }

    showAddModal() {
        const ref = this.dialogService.open(LoaiNhapXuatDetailComponent, {
            header: 'Thêm loại phiếu nhập xuất',
            modal: true,
            width: '70%',
            dismissableMask: true,
            closable: true
        });

        ref.onClose.subscribe(data => {
            if (data) {
                this.notification.showSuccess('Thêm thành công');
                this.loadData();
            }
        });
    }

    showEditModal() {
        if (this.selectedItems.length !== 1) {
            this.notification.showError('Chọn 1 bản ghi để sửa');
            return;
        }

        const ref = this.dialogService.open(LoaiNhapXuatDetailComponent, {
            header: 'Cập nhật loại nhập xuất',
            data: { id: this.selectedItems[0].id },
            modal: true,
            width: '70%',
            dismissableMask: true,
            closable: true
        });

        ref.onClose.subscribe(data => {
            if (data) {
                this.notification.showSuccess('Cập nhật thành công');
                this.loadData();
                this.selectedItems = [];
            }
        });
    }

    deleteItems() {
        if (!this.selectedItems.length) {
            this.notification.showError('Chọn ít nhất 1 bản ghi');
            return;
        }

        const ids = this.selectedItems.map(x => x.id);

        this.confirm.confirm({
            message: `Bạn có chắc muốn xóa ${ids.length} bản ghi?`,
            header: 'Xác nhận',
            icon: 'pi pi-exclamation-triangle',
            accept: () => this.deleteConfirmed(ids)
        });
    }

    deleteConfirmed(ids: string[]) {
        this.toggleBlockUI(true);
        this.service.deleteMultiple(ids)
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe({
                next: () => {
                    this.notification.showSuccess('Xóa thành công');
                    this.loadData();
                    this.selectedItems = [];
                    this.toggleBlockUI(false);
                },
                error: () => this.toggleBlockUI(false)
            });
    }

    getKieuText(type: number) {
        return ({
            1: 'Nhập',
            2: 'Xuất',
            3: 'Chuyển kho',
            4: 'Điều chỉnh'
        } as any)[type] || '';
    }

    toggleBlockUI(enabled: boolean) {
        if (enabled) this.blockedPanel = true;
        else setTimeout(() => this.blockedPanel = false, 800);
    }
}
