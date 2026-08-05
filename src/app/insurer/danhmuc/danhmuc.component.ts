import { DanhMucDto, DanhMucInListDto } from '@/proxy/viet-life/tuong-tac/insurer/danh-mucs';
import { DanhMucsService } from '@/proxy/viet-life/tuong-tac/insurers';
import { NotificationService } from '@/shared/services/notification.service';
import { PagedResultDto } from '@abp/ng.core';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { DanhmucDetailComponent } from './danhmuc-detail.component';
import { StandaloneSharedModule } from '@/standaloneshare.module';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-danhmuc.component',
  standalone: true,
  imports: [StandaloneSharedModule],
  templateUrl: './danhmuc.component.html',
  styleUrl: './danhmuc.component.scss'
})
export class DanhmucComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject<void>();
  blockedPanel = false;
  items: DanhMucInListDto[] = [];
  selectedItems: DanhMucInListDto[] = [];

  mediaBaseUrl = environment.apis.default.url + '/files/';

  skipCount = 0;
  maxResultCount = 10;
  totalCount = 0;
  keyword = '';

  constructor(
    private danhMucService: DanhMucsService,
    private dialogService: DialogService,
    private notificationService: NotificationService,
    private confirmationService: ConfirmationService,
  ) {}

  ngOnInit(): void { this.loadData(); }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  loadData() {
    this.toggleBlockUI(true);
    this.danhMucService.getListFilter({
      keyword: this.keyword,
      maxResultCount: this.maxResultCount,
      skipCount: this.skipCount,
    }).pipe(takeUntil(this.ngUnsubscribe)).subscribe({
      next: (res: PagedResultDto<DanhMucInListDto>) => {
        this.items = res.items;
        this.totalCount = res.totalCount;
        this.toggleBlockUI(false);
      },
      error: () => this.toggleBlockUI(false),
    });
  }

  // ✅ Simple helper để tạo full URL
  getImageUrl(fileName: string): string {
    return fileName ? this.mediaBaseUrl + fileName : '';
  }

  pageChanged(event: any): void {
    this.skipCount = event.first;
    this.maxResultCount = event.rows;
    this.loadData();
  }

  showAddModal() {
    const ref = this.dialogService.open(DanhmucDetailComponent, {
      header: 'Thêm mới danh mục',
      modal: true, width: '55%',
      dismissableMask: true, closable: true,
    });
    ref.onClose.subscribe((data: DanhMucDto) => {
      if (data) {
        this.loadData();
        this.notificationService.showSuccess('Thêm danh mục thành công');
        this.selectedItems = [];
      }
    });
  }

  showEditModal() {
    if (this.selectedItems.length === 0) {
      this.notificationService.showError('Bạn phải chọn một bản ghi');
      return;
    }
    const ref = this.dialogService.open(DanhmucDetailComponent, {
      data: { id: this.selectedItems[0].id },
      header: 'Cập nhật danh mục',
      modal: true, width: '55%',
      dismissableMask: true, closable: true,
    });
    ref.onClose.subscribe((data: DanhMucDto) => {
      if (data) {
        this.loadData();
        this.selectedItems = [];
        this.notificationService.showSuccess('Cập nhật danh mục thành công');
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
      message: 'Bạn có chắc muốn xóa các danh mục đã chọn?',
      accept: () => this.deleteItemsConfirmed(ids),
    });
  }

  deleteItemsConfirmed(ids: string[]) {
    this.toggleBlockUI(true);
    this.danhMucService.deleteMultiple(ids)
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
      setTimeout(() => this.blockedPanel = false, 1000);
    }
  }
}