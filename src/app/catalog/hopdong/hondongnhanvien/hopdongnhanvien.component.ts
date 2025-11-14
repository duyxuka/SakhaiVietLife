import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { DialogService } from 'primeng/dynamicdialog';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { ConfirmationService } from 'primeng/api';
import { PagedResultDto } from '@abp/ng.core';
import { StandaloneSharedModule } from '@/standaloneshare.module';
import { HopDongNhanVienDto } from '@/proxy/viet-life/catalog/hop-dongs/hop-dong-nhan-viens';
import { HopDongNhanViensService } from '@/proxy/viet-life/catalog/hop-dongs';
import { HopDongNhanVienDetailComponent } from './hopdongnhanvien-detail.component';

@Component({
  selector: 'app-hop-dong-nhan-vien',
  templateUrl: './hopdongnhanvien.component.html',
  standalone: true,
  imports: [StandaloneSharedModule]
})
export class HopDongNhanVienComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject<void>();
  blockedPanel = false;
  items: HopDongNhanVienDto[] = [];
  selectedItems: HopDongNhanVienDto[] = [];
  skipCount = 0;
  maxResultCount = 10;
  totalCount = 0;
  keyword = '';

  constructor(
    private service: HopDongNhanViensService,
    private dialogService: DialogService,
    private notificationService: NotificationService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void { this.loadData(); }
  ngOnDestroy(): void { this.ngUnsubscribe.next(); this.ngUnsubscribe.complete(); }

  loadData() {
    this.toggleBlockUI(true);
    this.service.getListFilter({ keyword: this.keyword, skipCount: this.skipCount, maxResultCount: this.maxResultCount })
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (res: PagedResultDto<HopDongNhanVienDto>) => { this.items = res.items; this.totalCount = res.totalCount; this.toggleBlockUI(false); },
        error: () => this.toggleBlockUI(false)
      });
  }

  pageChanged(event: any) { this.skipCount = event.first; this.maxResultCount = event.rows; this.loadData(); }

  showAddModal() {
    const ref = this.dialogService.open(HopDongNhanVienDetailComponent, { header: 'Thêm hợp đồng', modal: true, width: '70%', dismissableMask: true });
    ref.onClose.subscribe(data => { if (data) { this.loadData(); this.notificationService.showSuccess('Thêm hợp đồng thành công'); this.selectedItems = []; } });
  }

  showEditModal() {
    if (this.selectedItems.length !== 1) { this.notificationService.showError('Chọn 1 bản ghi'); return; }
    const ref = this.dialogService.open(HopDongNhanVienDetailComponent, { data: { id: this.selectedItems[0].id }, header: 'Cập nhật hợp đồng', modal: true, width: '70%', dismissableMask: true });
    ref.onClose.subscribe(data => { if (data) { this.loadData(); this.notificationService.showSuccess('Cập nhật thành công'); this.selectedItems = []; } });
  }

  deleteItems() {
    if (!this.selectedItems.length) { this.notificationService.showError('Chọn ít nhất 1 bản ghi'); return; }
    const ids = this.selectedItems.map(x => x.id);
    this.confirmationService.confirm({ message: 'Bạn có chắc muốn xóa?', accept: () => this.deleteItemsConfirmed(ids) });
  }

  private deleteItemsConfirmed(ids: string[]) {
    this.toggleBlockUI(true);
    this.service.deleteMultiple(ids).pipe(takeUntil(this.ngUnsubscribe)).subscribe({
      next: () => { this.notificationService.showSuccess('Xóa thành công'); this.loadData(); this.selectedItems = []; this.toggleBlockUI(false); },
      error: () => this.toggleBlockUI(false)
    });
  }

  private toggleBlockUI(enabled: boolean) { this.blockedPanel = enabled; if (!enabled) setTimeout(() => this.blockedPanel = false, 1000); }
}
