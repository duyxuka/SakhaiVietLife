import { Component, OnDestroy, OnInit } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { PagedResultDto } from '@abp/ng.core';
import { Subject, takeUntil } from 'rxjs';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { KhachHangDetailComponent } from './khachhang-detail.component';
import { StandaloneSharedModule } from '@/standaloneshare.module';
import { KhachHangDto, KhachHangInListDto } from '@/proxy/viet-life/business/khach-hangs-list/khach-hangs';
import { KhachHangsService } from '@/proxy/viet-life/business/khach-hangs';

@Component({
  selector: 'app-khachhang',
  templateUrl: './khachhang.component.html',
  standalone: true,
  imports: [StandaloneSharedModule],
})
export class KhachHangComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject<void>();

  items: KhachHangInListDto[] = [];
  selectedItems: KhachHangInListDto[] = [];

  blockedPanel = false;

  skipCount = 0;
  maxResultCount = 10;
  totalCount = 0;

  keyword = '';

  constructor(
    private khService: KhachHangsService,
    private dialogService: DialogService,
    private confirmationService: ConfirmationService,
    private notificationService: NotificationService
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
      this.khService.getListFilter({
        keyword: this.keyword,
        skipCount: this.skipCount,
        maxResultCount: this.maxResultCount
      })
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (res: PagedResultDto<KhachHangInListDto>) => {
          this.items = res.items;
          this.totalCount = res.totalCount;
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
    const ref = this.dialogService.open(KhachHangDetailComponent, {
      header: 'Thêm khách hàng',
      width: '70%',
      modal: true,
      closable: true,
      dismissableMask: true,
    });

    ref.onClose.subscribe((data: KhachHangDto) => {
      if (data) {
        this.loadData();
        this.notificationService.showSuccess('Thêm thành công');
        this.selectedItems = [];
      }
    });
  }

  showEditModal() {
    if (this.selectedItems.length !== 1) {
      this.notificationService.showError('Vui lòng chọn 1 bản ghi');
      return;
    }

    const id = this.selectedItems[0].id;

    const ref = this.dialogService.open(KhachHangDetailComponent, {
      header: 'Cập nhật khách hàng',
      width: '70%',
      modal: true,
      closable: true,
      dismissableMask: true,
      data: { id },
    });

    ref.onClose.subscribe((data: KhachHangDto) => {
      if (data) {
        this.loadData();
        this.notificationService.showSuccess('Cập nhật thành công');
        this.selectedItems = [];
      }
    });
  }

  deleteItems() {
    if (!this.selectedItems.length) {
      this.notificationService.showError('Bạn phải chọn bản ghi để xóa!');
      return;
    }

    const ids = this.selectedItems.map(x => x.id);

    this.confirmationService.confirm({
      message: 'Bạn có chắc muốn xóa?',
      accept: () => this.deleteItemsConfirmed(ids),
    });
  }

  deleteItemsConfirmed(ids: string[]) {
    this.toggleBlockUI(true);

    this.khService
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
    if (enabled == true) {
      this.blockedPanel = true;
    } else {
      setTimeout(() => {
        this.blockedPanel = false;
      }, 1000);
    }
  }
}
