import { PagedResultDto } from '@abp/ng.core';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  TienDoLamViecDto,
  TienDoLamViecInListDto,
} from '@proxy/viet-life/catalog/kpis/tien-do-lam-viecs';
import { ConfirmationService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { TienDoLamViecDetailComponent } from './tiendolamviec-detail.component';
import { TienDoLamViecsService } from '@proxy/viet-life/catalog/kpis';
import { StandaloneSharedModule } from '../../../standaloneshare.module';

@Component({
  selector: 'app-tiendolamviec',
  templateUrl: './tiendolamviec.component.html',
  styleUrls: ['./tiendolamviec.component.scss'],
  standalone: true,
    imports: [
      StandaloneSharedModule
    ]
})
export class TienDoLamViecComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject<void>();
  blockedPanel = false;
  items: TienDoLamViecInListDto[] = [];
  selectedItems: TienDoLamViecInListDto[] = [];

  // Paging
  skipCount = 0;
  maxResultCount = 10;
  totalCount = 0;

  constructor(
    private tienDoService: TienDoLamViecsService,
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
    this.tienDoService
      .getListFilter({
        maxResultCount: this.maxResultCount,
        skipCount: this.skipCount,
      })
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (response: PagedResultDto<TienDoLamViecInListDto>) => {
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
    const ref = this.dialogService.open(TienDoLamViecDetailComponent, {
      header: 'Thêm mới tiến độ làm việc',
      width: '60%',
    });

    ref.onClose.subscribe((data: TienDoLamViecDto) => {
      if (data) {
        this.loadData();
        this.notificationService.showSuccess('Thêm tiến độ thành công');
        this.selectedItems = [];
      }
    });
  }

  showEditModal() {
    if (this.selectedItems.length !== 1) {
      this.notificationService.showError('Chọn đúng 1 bản ghi để sửa');
      return;
    }

    const id = this.selectedItems[0].id;
    const ref = this.dialogService.open(TienDoLamViecDetailComponent, {
      data: { id },
      header: 'Cập nhật tiến độ làm việc',
      width: '60%',
    });

    ref.onClose.subscribe((data: TienDoLamViecDto) => {
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
    this.tienDoService
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
