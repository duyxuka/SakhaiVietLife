import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { PagedResultDto } from '@abp/ng.core';
import { DialogService } from 'primeng/dynamicdialog';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { ConfirmationService } from 'primeng/api';
import { StandaloneSharedModule } from '@/standaloneshare.module';
import { LoaiHopDongDto } from '@/proxy/viet-life/catalog/hop-dongs/loai-hop-dongs';
import { LoaiHopDongsService } from '@/proxy/viet-life/catalog/hop-dongs';
import { LoaiHopDongDetailComponent } from './loaihopdong-detail.component';

@Component({
  selector: 'app-loai-hop-dong',
  templateUrl: './loaihopdong.component.html',
  standalone: true,
  imports: [StandaloneSharedModule]
})
export class LoaiHopDongComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject<void>();
  blockedPanel = false;
  items: LoaiHopDongDto[] = [];
  selectedItems: LoaiHopDongDto[] = [];
  skipCount = 0;
  maxResultCount = 10;
  totalCount = 0;
  keyword = '';

  constructor(
    private service: LoaiHopDongsService,
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
        next: (res: PagedResultDto<LoaiHopDongDto>) => {
          this.items = res.items;
          this.totalCount = res.totalCount;
        },
        error: () => {},
        complete: () => this.toggleBlockUI(false)
      });
  }

  pageChanged(event: any) {
    this.skipCount = event.first;
    this.maxResultCount = event.rows;
    this.loadData();
  }

  showAddModal() {
    const ref = this.dialogService.open(LoaiHopDongDetailComponent, {
      header: 'Thêm loại hợp đồng',
      modal: true,
      width: '70%',
      dismissableMask: true,
      closable: true
    });

    ref.onClose.subscribe(data => {
      if (data) {
        this.loadData();
        this.selectedItems = [];
        this.notificationService.showSuccess('Thêm thành công');
      }
    });
  }

  showEditModal() {
    if (this.selectedItems.length !== 1) {
      this.notificationService.showError('Chọn 1 bản ghi');
      return;
    }

    const ref = this.dialogService.open(LoaiHopDongDetailComponent, {
      data: { id: this.selectedItems[0].id },
      header: 'Cập nhật loại hợp đồng',
      modal: true,
      width: '70%',
      dismissableMask: true,
      closable: true
    });

    ref.onClose.subscribe(data => {
      if (data) {
        this.loadData();
        this.selectedItems = [];
        this.notificationService.showSuccess('Cập nhật thành công');
      }
    });
  }

  deleteItems() {
    if (!this.selectedItems.length) {
      this.notificationService.showError('Chọn ít nhất 1 bản ghi');
      return;
    }
    const ids = this.selectedItems.map(x => x.id);
    this.confirmationService.confirm({
      message: 'Bạn có chắc muốn xóa?',
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
          this.selectedItems = [];
          this.loadData();
        },
        error: () => {},
        complete: () => this.toggleBlockUI(false)
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
