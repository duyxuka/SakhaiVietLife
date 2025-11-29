import { Component, OnDestroy, OnInit } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { ConfirmationService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { PagedResultDto } from '@abp/ng.core';
import { StandaloneSharedModule } from '@/standaloneshare.module';
import { LoaiKhachHangDto, LoaiKhachHangInListDto } from '@/proxy/viet-life/business/khach-hangs-list/loai-khach-hangs';
import { LoaiKhachHangsService } from '@/proxy/viet-life/business/khach-hangs';
import { LoaiKhachHangDetailComponent } from './loaikhachhang-detail.component';

@Component({
  selector: 'app-loaikhachhang',
  templateUrl: './loaikhachhang.component.html',
  standalone: true,
  imports: [StandaloneSharedModule],
})
export class LoaiKhachHangComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject<void>();
  blockedPanel = false;

  items: LoaiKhachHangInListDto[] = [];
  selectedItems: LoaiKhachHangInListDto[] = [];

  keyword = '';
  skipCount = 0;
  maxResultCount = 10;
  totalCount: number;

  constructor(
    private service: LoaiKhachHangsService,
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
        maxResultCount: this.maxResultCount,
      })
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (response: PagedResultDto<LoaiKhachHangInListDto>) => {
          this.items = response.items;
          this.totalCount = response.totalCount;
          this.toggleBlockUI(false);
        },
        error: () => this.toggleBlockUI(false),
      });
  }

  pageChanged(event: any) {
    this.skipCount = event.first;
    this.maxResultCount = event.rows;
    this.loadData();
  }

  showAddModal() {
    const ref = this.dialogService.open(LoaiKhachHangDetailComponent, {
      header: 'Thêm mới loại khách hàng',
      width: '70%',
      modal: true,
      dismissableMask: true,
      closable: true,
    });

    ref.onClose.subscribe((data: LoaiKhachHangDto) => {
      if (data) {
        this.loadData();
        this.notificationService.showSuccess('Thêm mới thành công');
        this.selectedItems = [];
      }
    });
  }

  showEditModal() {
    if (this.selectedItems.length !== 1) {
      this.notificationService.showError('Bạn phải chọn một bản ghi');
      return;
    }

    const id = this.selectedItems[0].id;

    const ref = this.dialogService.open(LoaiKhachHangDetailComponent, {
      data: { id },
      header: 'Cập nhật loại khách hàng',
      width: '70%',
      modal: true,
      dismissableMask: true,
      closable: true,
    });

    ref.onClose.subscribe((data: LoaiKhachHangDto) => {
      if (data) {
        this.loadData();
        this.notificationService.showSuccess('Cập nhật thành công');
        this.selectedItems = [];
      }
    });
  }

  deleteItems() {
    if (this.selectedItems.length === 0) {
      this.notificationService.showError('Phải chọn ít nhất một bản ghi');
      return;
    }

    const ids = this.selectedItems.map(x => x.id);

    this.confirmationService.confirm({
      message: 'Bạn có chắc muốn xóa các bản ghi đã chọn?',
      accept: () => this.deleteItemsConfirmed(ids),
    });
  }

  deleteItemsConfirmed(ids: string[]) {
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
        error: () => this.toggleBlockUI(false),
      });
  }

  private toggleBlockUI(enabled: boolean) {
    if (enabled) {
      this.blockedPanel = true;
    } else {
      setTimeout(() => (this.blockedPanel = false), 1000);
    }
  }
}
