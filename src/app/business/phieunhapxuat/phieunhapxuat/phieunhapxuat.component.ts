import { Component, OnDestroy, OnInit } from '@angular/core';
import { PagedResultDto } from '@abp/ng.core';
import { Subject, takeUntil } from 'rxjs';
import { ConfirmationService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { StandaloneSharedModule } from '@/standaloneshare.module';
import { PhieuNhapXuatInListDto } from '@/proxy/viet-life/business/nhap-xuats/phieu-nhap-xuats';
import { PhieuNhapXuatsService } from '@/proxy/viet-life/business/nhap-xuats';
import { PhieuNhapXuatDetailComponent } from './phieunhapxuat-detail.component';

@Component({
  selector: 'app-phieu-nhap-xuat',
  templateUrl: './phieunhapxuat.component.html',
  standalone: true,
  imports: [StandaloneSharedModule],
})
export class PhieuNhapXuatComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject<void>();
  blockedPanel = false;

  items: PhieuNhapXuatInListDto[] = [];
  selectedItems: PhieuNhapXuatInListDto[] = [];

  skipCount = 0;
  maxResultCount = 10;
  totalCount = 0;

  keyword = '';

  constructor(
    private service: PhieuNhapXuatsService,
    private dialogService: DialogService,
    private notificationService: NotificationService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  loadData() {
    this.toggleBlockUI(true);

    this.service
      .getListFilter({
        keyword: this.keyword,
        skipCount: this.skipCount,
        maxResultCount: this.maxResultCount
      })
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (res: PagedResultDto<PhieuNhapXuatInListDto>) => {
          this.items = res.items || [];
          this.totalCount = res.totalCount || 0;
          this.toggleBlockUI(false);
        },
        error: () => {
          this.toggleBlockUI(false);
        }
      });
  }

  pageChanged(event: any) {
    this.skipCount = event.first;
    this.maxResultCount = event.rows;
    this.loadData();
  }

  showAddModal() {
    const ref = this.dialogService.open(PhieuNhapXuatDetailComponent, {
      header: 'Thêm phiếu nhập/xuất',
      width: '70%',
      modal: true,
      closable: true,
      dismissableMask: true,
    });

    ref.onClose.subscribe((data) => {
      if (data) {
        this.loadData();
        this.notificationService.showSuccess('Thêm phiếu thành công');
        this.selectedItems = [];
      }
    });
  }

  showEditModal() {
    if (this.selectedItems.length !== 1) {
      this.notificationService.showError('Vui lòng chọn 1 phiếu để chỉnh sửa');
      return;
    }

    const id = this.selectedItems[0].id;
    const ref = this.dialogService.open(PhieuNhapXuatDetailComponent, {
      header: 'Cập nhật phiếu',
      width: '70%',
      modal: true,
      data: { id },
      closable: true,
      dismissableMask: true,
    });

    ref.onClose.subscribe((data) => {
      if (data) {
        this.loadData();
        this.notificationService.showSuccess('Cập nhật thành công');
        this.selectedItems = [];
      }
    });
  }

  deleteItems() {
    if (this.selectedItems.length === 0) {
      this.notificationService.showError('Vui lòng chọn ít nhất 1 phiếu');
      return;
    }

    const count = this.selectedItems.length;

    this.confirmationService.confirm({
      message: `Bạn có chắc muốn xóa ${count} phiếu này?`,
      header: 'Xác nhận xóa',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        const ids = this.selectedItems.map(x => x.id);
        this.deleteItemsConfirmed(ids);
      },
    });
  }

  private deleteItemsConfirmed(ids: string[]) {
    this.toggleBlockUI(true);

    this.service
      .deleteMultiple(ids)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: () => {
          this.notificationService.showSuccess('Xóa thành công');
          this.loadData();
          this.selectedItems = [];
          this.toggleBlockUI(false);
        },
        error: () => {
          this.toggleBlockUI(false);
        }
      });
  }

  // === BLOCK UI ===
  private toggleBlockUI(enabled: boolean) {
    if (enabled) {
      this.blockedPanel = true;
    } else {
      setTimeout(() => {
        this.blockedPanel = false;
      }, 800);
    }
  }
}
