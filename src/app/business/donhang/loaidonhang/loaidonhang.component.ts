import { Component, OnDestroy, OnInit } from '@angular/core';
import { PagedResultDto } from '@abp/ng.core';
import { ConfirmationService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { LoaiDonHangDetailComponent } from './loaidonhang-detail.component';
import { StandaloneSharedModule } from '@/standaloneshare.module';
import { LoaiDonHangInListDto } from '@/proxy/viet-life/business/don-hangs-list/loai-don-hangs';
import { LoaiDonHangsService } from '@/proxy/viet-life/business/don-hangs';

@Component({
  selector: 'app-loai-don-hang',
  templateUrl: './loaidonhang.component.html',
  standalone: true,
  imports: [StandaloneSharedModule]
})
export class LoaiDonHangComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject<void>();
  blockedPanel = false;
  items: LoaiDonHangInListDto[] = [];
  selectedItems: LoaiDonHangInListDto[] = [];
  skipCount = 0;
  maxResultCount = 10;
  totalCount = 0;
  keyword = '';

  constructor(
    private service: LoaiDonHangsService,
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
    this.service.getListFilter({ keyword: this.keyword, skipCount: this.skipCount, maxResultCount: this.maxResultCount })
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (res: PagedResultDto<LoaiDonHangInListDto>) => {
          this.items = res.items || [];
          this.totalCount = res.totalCount || 0;
          this.toggleBlockUI(false);
        },
        error: () => this.toggleBlockUI(false)
      });
  }

  pageChanged(event: any) {
    this.skipCount = event.first;
    this.maxResultCount = event.rows;
    this.loadData();
  }

  showAddModal() {
    const ref = this.dialogService.open(LoaiDonHangDetailComponent, {
      header: 'Thêm loại đơn hàng',
      width: '70%',
      modal: true,
      closable: true,
      dismissableMask: true,
    });

    ref.onClose.subscribe(data => {
      if (data) {
        this.loadData();
        this.notificationService.showSuccess('Thêm thành công');
        this.selectedItems = [];
      }
    });
  }

  showEditModal() {
    if (this.selectedItems.length !== 1) {
      this.notificationService.showError('Vui lòng chọn 1 loại đơn hàng để chỉnh sửa');
      return;
    }

    const id = this.selectedItems[0].id;
    const ref = this.dialogService.open(LoaiDonHangDetailComponent, {
      data: { id },
      header: 'Cập nhật loại đơn hàng',
      width: '70%',
      modal: true,
      closable: true,
      dismissableMask: true,
    });

    ref.onClose.subscribe(data => {
      if (data) {
        this.loadData();
        this.notificationService.showSuccess('Cập nhật thành công');
        this.selectedItems = [];
      }
    });
  }

  deleteItems() {
    if (!this.selectedItems.length) {
      this.notificationService.showError('Vui lòng chọn ít nhất 1 loại đơn hàng');
      return;
    }

    const count = this.selectedItems.length;
    this.confirmationService.confirm({
      message: `Bạn có chắc muốn xóa ${count} loại đơn hàng này?`,
      header: 'Xác nhận xóa',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        const ids = this.selectedItems.map(x => x.id);
        this.service.deleteMultiple(ids)
          .pipe(takeUntil(this.ngUnsubscribe))
          .subscribe({
            next: () => {
              this.notificationService.showSuccess('Xóa thành công');
              this.loadData();
              this.selectedItems = [];
            }
          });
      }
    });
  }

  private toggleBlockUI(enabled: boolean) {
    if (enabled == true) {
      this.blockedPanel = true;
    } else {
      setTimeout(() => {
        this.blockedPanel = false;
      }, 1000);
    }
  }
}
