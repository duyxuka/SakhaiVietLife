import { BaiVietDto, BaiVietInListDto } from '@/proxy/viet-life/tuong-tac/insurer/bai-viets';
import { BaiVietsService } from '@/proxy/viet-life/tuong-tac/insurers';
import { NotificationService } from '@/shared/services/notification.service';
import { StandaloneSharedModule } from '@/standaloneshare.module';
import { PagedResultDto } from '@abp/ng.core';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BaivietDetailComponent } from './baiviet-detail.component';

@Component({
  selector: 'app-baiviet.component',
  templateUrl: './baiviet.component.html',
  styleUrl: './baiviet.component.scss',
  standalone: true,
  imports: [StandaloneSharedModule]
})
export class BaivietComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject<void>();
  blockedPanel = false;
  items: BaiVietInListDto[] = [];
  selectedItems: BaiVietInListDto[] = [];

  skipCount = 0;
  maxResultCount = 10;
  totalCount = 0;
  keyword = '';

  mediaBaseUrl = environment.apis.default.url + '/files/';

  constructor(
    private baiVietService: BaiVietsService,
    private dialogService: DialogService,
    private notificationService: NotificationService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void { this.loadData(); }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  loadData() {
    this.toggleBlockUI(true);
    this.baiVietService.getListFilter({
      keyword: this.keyword,
      maxResultCount: this.maxResultCount,
      skipCount: this.skipCount,
    }).pipe(takeUntil(this.ngUnsubscribe)).subscribe({
      next: (res: PagedResultDto<BaiVietInListDto>) => {
        this.items = res.items;
        this.totalCount = res.totalCount;
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
    const ref = this.dialogService.open(BaivietDetailComponent, {
      header: 'Thêm mới bài viết',
      modal: true, width: '75%',
      dismissableMask: true, closable: true,
    });
    ref.onClose.subscribe((data: BaiVietDto) => {
      if (data) {
        this.loadData();
        this.notificationService.showSuccess('Thêm bài viết thành công');
        this.selectedItems = [];
      }
    });
  }

  showEditModal() {
    if (this.selectedItems.length === 0) {
      this.notificationService.showError('Bạn phải chọn một bản ghi');
      return;
    }
    const ref = this.dialogService.open(BaivietDetailComponent, {
      data: { id: this.selectedItems[0].id },
      header: 'Cập nhật bài viết',
      modal: true, width: '75%',
      dismissableMask: true, closable: true,
    });
    ref.onClose.subscribe((data: BaiVietDto) => {
      if (data) {
        this.loadData();
        this.selectedItems = [];
        this.notificationService.showSuccess('Cập nhật bài viết thành công');
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
      message: 'Bạn có chắc muốn xóa các bài viết đã chọn?',
      accept: () => this.deleteItemsConfirmed(ids),
    });
  }

  deleteItemsConfirmed(ids: string[]) {
    this.toggleBlockUI(true);
    this.baiVietService.deleteMultiple(ids)
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

  // ✅ Đơn giản nhất - trực tiếp dùng URL, không gọi API base64 nữa
  getImageUrl(fileName: string): string {
    return fileName ? this.mediaBaseUrl + fileName : '';
  }

  private toggleBlockUI(enabled: boolean) {
    if (enabled) {
      this.blockedPanel = true;
    } else {
      setTimeout(() => this.blockedPanel = false, 1000);
    }
  }
}