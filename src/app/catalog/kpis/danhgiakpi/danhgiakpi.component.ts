import { PagedResultDto } from '@abp/ng.core';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  DanhGiaKpiDto,
  DanhGiaKpiInListDto,
} from '@proxy/viet-life/catalog/kpis/danh-gia-kpis';
import { ConfirmationService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { DanhGiaKpiDetailComponent } from './danhgiakpi-detail.component';
import { DanhGiaKpisService } from '@proxy/viet-life/catalog/kpis';
import { StandaloneSharedModule } from '../../../standaloneshare.module';

@Component({
  selector: 'app-danhgiakpi',
  templateUrl: './danhgiakpi.component.html',
  styleUrls: ['./danhgiakpi.component.scss'],
  standalone: true,
    imports: [
      StandaloneSharedModule
    ]
})
export class DanhGiaKpiComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject<void>();
  blockedPanel = false;
  items: DanhGiaKpiInListDto[] = [];
  selectedItems: DanhGiaKpiInListDto[] = [];

  // Paging
  skipCount = 0;
  maxResultCount = 10;
  totalCount = 0;

  constructor(
    private danhGiaKpiService: DanhGiaKpisService,
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
    this.danhGiaKpiService
      .getListFilter({
        maxResultCount: this.maxResultCount,
        skipCount: this.skipCount,
      })
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (response: PagedResultDto<DanhGiaKpiInListDto>) => {
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
    const ref = this.dialogService.open(DanhGiaKpiDetailComponent, {
      header: 'Thêm mới đánh giá KPI',
      width: '60%',
    });

    ref.onClose.subscribe((data: DanhGiaKpiDto) => {
      if (data) {
        this.loadData();
        this.notificationService.showSuccess('Thêm đánh giá KPI thành công');
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
    const ref = this.dialogService.open(DanhGiaKpiDetailComponent, {
      data: { id },
      header: 'Cập nhật đánh giá KPI',
      width: '60%',
    });

    ref.onClose.subscribe((data: DanhGiaKpiDto) => {
      if (data) {
        this.loadData();
        this.notificationService.showSuccess('Cập nhật thành công');
        this.selectedItems = [];
      }
    });
  }

  deleteItems() {
    if (this.selectedItems.length === 0) {
      this.notificationService.showError('Phải chọn ít nhất một bản ghi để xóa');
      return;
    }

    const ids = this.selectedItems.map((x) => x.id);
    this.confirmationService.confirm({
      message: 'Bạn có chắc muốn xóa các bản ghi đã chọn?',
      accept: () => this.deleteItemsConfirmed(ids),
    });
  }

  deleteItemsConfirmed(ids: string[]) {
    this.toggleBlockUI(true);
    this.danhGiaKpiService
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
