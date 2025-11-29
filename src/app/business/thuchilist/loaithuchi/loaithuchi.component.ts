import { Component, OnDestroy, OnInit } from '@angular/core';
import { PagedResultDto } from '@abp/ng.core';
import { DialogService } from 'primeng/dynamicdialog';
import { ConfirmationService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { StandaloneSharedModule } from '@/standaloneshare.module';
import { LoaiThuChiDto, LoaiThuChiInListDto } from '@/proxy/viet-life/business/thu-chis-list/loai-thu-chis';
import { LoaiThuChisService } from '@/proxy/viet-life/business/thu-chis';
import { LoaiThuChiDetailComponent } from './loaithuchi-detail.component';

@Component({
  selector: 'app-loai-thu-chi',
  templateUrl: './loaithuchi.component.html',
  standalone: true,
  imports: [StandaloneSharedModule],
})
export class LoaiThuChiComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject<void>();
  items: LoaiThuChiInListDto[] = [];
  selectedItems: LoaiThuChiInListDto[] = [];

  keyword = '';
  skipCount = 0;
  maxResultCount = 10;
  totalCount: number;

  blockedPanel = false;

  constructor(
    private loaiService: LoaiThuChisService,
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
    this.loaiService
      .getListFilter({
        keyword: this.keyword,
        skipCount: this.skipCount,
        maxResultCount: this.maxResultCount,
      })
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (response: PagedResultDto<LoaiThuChiInListDto>) => {
          this.items = response.items;
          this.totalCount = response.totalCount;
          this.toggleBlockUI(false);
        },
        error: () => this.toggleBlockUI(false),
      });
  }

  pageChanged(event: any) {
    this.skipCount = event.first;
    this.maxResultCount = event.rows;
    this.loadData();
  }

  showAddModal() {
    const ref = this.dialogService.open(LoaiThuChiDetailComponent, {
      header: 'Thêm mới loại thu chi',
      width: '70%',
      modal: true,
      closable: true,
      dismissableMask: true,
    });

    ref.onClose.subscribe((data: LoaiThuChiDto) => {
      if (data) {
        this.notificationService.showSuccess('Thêm loại thu chi thành công');
        this.loadData();
        this.selectedItems = [];
      }
    });
  }

  showEditModal() {
    if (this.selectedItems.length !== 1) {
      this.notificationService.showError('Bạn phải chọn một bản ghi');
      return;
    }

    const id = this.selectedItems[0].id;

    const ref = this.dialogService.open(LoaiThuChiDetailComponent, {
      header: 'Cập nhật loại thu chi',
      width: '70%',
      modal: true,
      closable: true,
      dismissableMask: true,
      data: { id },
    });

    ref.onClose.subscribe((data: LoaiThuChiDto) => {
      if (data) {
        this.notificationService.showSuccess('Cập nhật thành công');
        this.loadData();
        this.selectedItems = [];
      }
    });
  }

  deleteItems() {
    if (this.selectedItems.length === 0) {
      this.notificationService.showError('Phải chọn ít nhất một bản ghi');
      return;
    }

    const ids = this.selectedItems.map((x) => x.id);

    this.confirmationService.confirm({
      message: 'Bạn có chắc muốn xóa những bản ghi này?',
      accept: () => this.deleteItemsConfirmed(ids),
    });
  }

  deleteItemsConfirmed(ids: string[]) {
    this.toggleBlockUI(true);
    this.loaiService
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

  private toggleBlockUI(value: boolean) {
    if (value) this.blockedPanel = true;
    else setTimeout(() => (this.blockedPanel = false), 1000);
  }
}
