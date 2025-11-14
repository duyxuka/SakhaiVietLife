import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { DialogService } from 'primeng/dynamicdialog';
import { ConfirmationService } from 'primeng/api';
import { PagedResultDto } from '@abp/ng.core';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { StandaloneSharedModule } from '@/standaloneshare.module';
import { NhomSanPhamDto, NhomSanPhamInListDto } from '@/proxy/viet-life/business/san-phams-list/nhom-san-phams';
import { NhomSanPhamsService } from '@/proxy/viet-life/business/san-phams';
import { NhomSanPhamDetailComponent } from './nhomsanpham-detail.component';

@Component({
  selector: 'app-nhomsanpham',
  templateUrl: './nhomsanpham.component.html',
  standalone: true,
  imports: [StandaloneSharedModule]
})
export class NhomSanPhamComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject<void>();
  blockedPanel: boolean = false;
  items: NhomSanPhamInListDto[] = [];
  selectedItems: NhomSanPhamInListDto[] = [];

  skipCount = 0;
  maxResultCount = 10;
  totalCount = 0;
  keyword: string = '';

  constructor(
    private nhomSanPhamService: NhomSanPhamsService,
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
    this.nhomSanPhamService.getListFilter({
      keyword: this.keyword,
      skipCount: this.skipCount,
      maxResultCount: this.maxResultCount
    }).pipe(takeUntil(this.ngUnsubscribe)).subscribe({
      next: (res: PagedResultDto<NhomSanPhamInListDto>) => {
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
    const ref = this.dialogService.open(NhomSanPhamDetailComponent, {
      header: 'Thêm mới nhóm sản phẩm',
      modal: true,
      width: '70%',
      dismissableMask: true,
      closable: true
    });

    ref.onClose.subscribe((data: NhomSanPhamDto) => {
      if (data) {
        this.loadData();
        this.notificationService.showSuccess('Thêm nhóm sản phẩm thành công');
        this.selectedItems = [];
      }
    });
  }

  showEditModal() {
    if (this.selectedItems.length === 0) {
      this.notificationService.showError('Bạn phải chọn một bản ghi');
      return;
    }
    const id = this.selectedItems[0].id;
    const ref = this.dialogService.open(NhomSanPhamDetailComponent, {
      data: { id },
      header: 'Cập nhật nhóm sản phẩm',
      modal: true,
      width: '70%',
      dismissableMask: true,
      closable: true
    });

    ref.onClose.subscribe((data: NhomSanPhamDto) => {
      if (data) {
        this.loadData();
        this.selectedItems = [];
        this.notificationService.showSuccess('Cập nhật nhóm sản phẩm thành công');
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
      message: 'Bạn có chắc muốn xóa các nhóm sản phẩm đã chọn?',
      accept: () => this.deleteItemsConfirmed(ids)
    });
  }

  deleteItemsConfirmed(ids: string[]) {
    this.toggleBlockUI(true);
    this.nhomSanPhamService.deleteMultiple(ids).pipe(takeUntil(this.ngUnsubscribe)).subscribe({
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
    this.blockedPanel = enabled;
  }
}
