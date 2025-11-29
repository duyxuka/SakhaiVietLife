import { PagedResultDto } from '@abp/ng.core';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { MucTieuKpiDto, MucTieuKpiInListDto } from '@proxy/viet-life/catalog/kpis/muc-tieu-kpis';
import { MucTieuKpisService } from '@proxy/viet-life/catalog/kpis';
import { MucTieuKpiDetailComponent } from './muctieukpi-detail.component';
import { StandaloneSharedModule } from '../../../standaloneshare.module';

@Component({
  selector: 'app-muctieukpi',
  templateUrl: './muctieukpi.component.html',
  styleUrls: ['./muctieukpi.component.scss'],
  standalone: true,
    imports: [
      StandaloneSharedModule
    ]
})
export class MucTieuKpiComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject<void>();
  blockedPanel = false;
  items: MucTieuKpiInListDto[] = [];
  selectedItems: MucTieuKpiInListDto[] = [];

  // Paging
  skipCount = 0;
  maxResultCount = 10;
  totalCount: number = 0;
  keyword: string = '';

  constructor(
    private mucTieuService: MucTieuKpisService,
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
    this.mucTieuService
      .getListFilter({
        keyword: this.keyword,
        maxResultCount: this.maxResultCount,
        skipCount: this.skipCount,
      })
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (response: PagedResultDto<MucTieuKpiInListDto>) => {
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
    const ref = this.dialogService.open(MucTieuKpiDetailComponent, {
      header: 'Thêm mới mục tiêu KPI',
      modal: true,
      width: '70%',
      dismissableMask: true,
      closable: true,
    });

    ref.onClose.subscribe((data: MucTieuKpiDto) => {
      if (data) {
        this.loadData();
        this.notificationService.showSuccess('Thêm mới thành công');
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
    const ref = this.dialogService.open(MucTieuKpiDetailComponent, {
      data: { id },
      header: 'Cập nhật mục tiêu KPI',
      modal: true,
      width: '70%',
      dismissableMask: true,
      closable: true,
    });

    ref.onClose.subscribe((data: MucTieuKpiDto) => {
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
    this.mucTieuService
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
