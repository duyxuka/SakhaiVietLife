import { Component, OnDestroy, OnInit } from '@angular/core';
import { PagedResultDto } from '@abp/ng.core';
import { KhoHangInListDto, KhoHangsService } from '@proxy/viet-life/business/kho-hangs';
import { ConfirmationService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { StandaloneSharedModule } from '../../standaloneshare.module';
import { KhoHangDetailComponent } from './khohang-detail.component';

@Component({
  selector: 'app-kho-hang',
  templateUrl: './khohang.component.html',
  standalone: true,
  imports: [StandaloneSharedModule]
})
export class KhoHangComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject<void>();
  blockedPanel = false;
  items: KhoHangInListDto[] = [];
  selectedItems: KhoHangInListDto[] = [];
  skipCount = 0;
  maxResultCount = 10;
  totalCount = 0;
  keyword = '';

  constructor(
    private service: KhoHangsService,
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
    this.service.getListFilter({
      keyword: this.keyword,
      skipCount: this.skipCount,
      maxResultCount: this.maxResultCount
    })
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe({
      next: (res: PagedResultDto<KhoHangInListDto>) => {
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
    const ref = this.dialogService.open(KhoHangDetailComponent, {
      header: 'Thêm kho hàng',
      modal: true,
      width: '70%',
      dismissableMask: true,
      closable: true
    });

    ref.onClose.subscribe(data => {
      if (data) {
        this.loadData();
        this.notificationService.showSuccess('Thêm kho hàng thành công');
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
    const ref = this.dialogService.open(KhoHangDetailComponent, {
      data: { id },
      header: 'Cập nhật kho hàng',
      modal: true,
      width: '70%',
      dismissableMask: true,
      closable: true
    });

    ref.onClose.subscribe(data => {
      if (data) {
        this.loadData();
        this.notificationService.showSuccess('Cập nhật kho hàng thành công');
        this.selectedItems = [];
      }
    });
  }

  deleteItems() {
    if (!this.selectedItems.length) {
      this.notificationService.showError('Vui lòng chọn ít nhất 1 bản ghi');
      return;
    }
    const ids = this.selectedItems.map(x => x.id);
    this.confirmationService.confirm({
      message: 'Bạn có chắc muốn xóa các kho hàng này?',
      accept: () => this.deleteItemsConfirmed(ids)
    });
  }

  private deleteItemsConfirmed(ids: string[]) {
    this.toggleBlockUI(true);
    this.service.deleteMultiple(ids)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: () => {
          this.notificationService.showSuccess('Xóa thành công');
          this.loadData();
          this.selectedItems = [];
          this.toggleBlockUI(false);
        },
        error: () => this.toggleBlockUI(false)
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