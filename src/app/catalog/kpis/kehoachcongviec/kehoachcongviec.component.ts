import { Component, OnInit, OnDestroy } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { ConfirmationService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { PagedResultDto } from '@abp/ng.core';

import { KeHoachCongViecDto, KeHoachCongViecInListDto } from '@proxy/viet-life/catalog/kpis/ke-hoach-cong-viecs';
import { KeHoachCongViecsService } from '@proxy/viet-life/catalog/kpis';
import { KeHoachCongViecDetailComponent } from './kehoachcongviec-detail.component';
import { StandaloneSharedModule } from '../../../standaloneshare.module';

@Component({
  selector: 'app-kehoachcongviec',
  templateUrl: './kehoachcongviec.component.html',
  styleUrls: ['./kehoachcongviec.component.scss'],
  standalone: true,
    imports: [
      StandaloneSharedModule
    ]
})
export class KeHoachCongViecComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject<void>();
  blockedPanel = false;

  items: KeHoachCongViecInListDto[] = [];
  selectedItems: KeHoachCongViecInListDto[] = [];

  // Paging
  skipCount = 0;
  maxResultCount = 10;
  totalCount = 0;

  constructor(
    private keHoachService: KeHoachCongViecsService,
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
    this.keHoachService
      .getListFilter({
        maxResultCount: this.maxResultCount,
        skipCount: this.skipCount,
      })
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (response: PagedResultDto<KeHoachCongViecInListDto>) => {
          this.items = response.items;
          this.totalCount = response.totalCount;
          this.toggleBlockUI(false);
        },
        error: () => this.toggleBlockUI(false),
      });
  }

  pageChanged(event: any): void {
    this.skipCount = event.first;
    this.maxResultCount = event.rows;
    this.loadData();
  }

  showAddModal() {
    const ref = this.dialogService.open(KeHoachCongViecDetailComponent, {
      header: 'Thêm mới kế hoạch công việc',
      modal: true,
      width: '70%',
      dismissableMask: true,
      closable: true,
    });

    ref.onClose.subscribe((data: KeHoachCongViecDto) => {
      if (data) {
        this.loadData();
        this.notificationService.showSuccess('Thêm kế hoạch công việc thành công');
        this.selectedItems = [];
      }
    });
  }

  showEditModal() {
    if (this.selectedItems.length !== 1) {
      this.notificationService.showError('Bạn phải chọn đúng 1 bản ghi để sửa');
      return;
    }

    const id = this.selectedItems[0].id;
    const ref = this.dialogService.open(KeHoachCongViecDetailComponent, {
      data: { id },
      header: 'Cập nhật kế hoạch công việc',
      modal: true,
      width: '70%',
      dismissableMask: true,
      closable: true,
    });

    ref.onClose.subscribe((data: KeHoachCongViecDto) => {
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

  private deleteItemsConfirmed(ids: string[]) {
    this.toggleBlockUI(true);
    this.keHoachService
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
    this.blockedPanel = enabled;
    if (!enabled) {
      setTimeout(() => (this.blockedPanel = false), 500);
    }
  }
}
