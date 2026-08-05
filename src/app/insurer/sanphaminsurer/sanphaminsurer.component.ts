import { SanPhamInsurerDto, SanPhamInsurerInListDto } from '@/proxy/viet-life/tuong-tac/insurer/san-pham-insurers';
import { SanPhamInsurersService } from '@/proxy/viet-life/tuong-tac/insurers';
import { NotificationService } from '@/shared/services/notification.service';
import { StandaloneSharedModule } from '@/standaloneshare.module';
import { PagedResultDto } from '@abp/ng.core';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { SanphaminsurerDetailComponent } from './sanphaminsurer-detail.component';

@Component({
  selector: 'app-sanphaminsurer.component',
  standalone: true,
  imports: [
    StandaloneSharedModule
  ],
  templateUrl: './sanphaminsurer.component.html',
  styleUrl: './sanphaminsurer.component.scss'
})
export class SanphaminsurerComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject<void>();
  blockedPanel: boolean = false;
  items: SanPhamInsurerInListDto[] = [];
  public selectedItems: SanPhamInsurerInListDto[] = [];
 
  // Paging variables
  public skipCount: number = 0;
  public maxResultCount: number = 10;
  public totalCount: number;
 
  // Filter
  keyword: string = '';
 
  constructor(
    private sanPhamService: SanPhamInsurersService,
    private dialogService: DialogService,
    private notificationService: NotificationService,
    private confirmationService: ConfirmationService,
  ) { }
 
  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
 
  ngOnInit(): void {
    this.loadData();
  }
 
  loadData() {
    this.toggleBlockUI(true);
    this.sanPhamService
      .getListFilter({
        keyword: this.keyword,
        maxResultCount: this.maxResultCount,
        skipCount: this.skipCount,
      })
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (response: PagedResultDto<SanPhamInsurerInListDto>) => {
          this.items = response.items;
          this.totalCount = response.totalCount;
          this.toggleBlockUI(false);
        },
        error: () => {
          this.toggleBlockUI(false);
        },
      });
  }
 
  pageChanged(event: any): void {
    this.skipCount = event.first;
    this.maxResultCount = event.rows;
    this.loadData();
  }
 
  showAddModal() {
    const ref = this.dialogService.open(SanphaminsurerDetailComponent, {
      header: 'Thêm mới sản phẩm',
      modal: true,
      width: '70%',
      dismissableMask: true,
      closable: true,
    });
 
    ref.onClose.subscribe((data: SanPhamInsurerDto) => {
      if (data) {
        this.loadData();
        this.notificationService.showSuccess('Thêm sản phẩm thành công');
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
    const ref = this.dialogService.open(SanphaminsurerDetailComponent, {
      data: { id },
      header: 'Cập nhật sản phẩm',
      modal: true,
      width: '70%',
      dismissableMask: true,
      closable: true,
    });
 
    ref.onClose.subscribe((data: SanPhamInsurerDto) => {
      if (data) {
        this.loadData();
        this.selectedItems = [];
        this.notificationService.showSuccess('Cập nhật sản phẩm thành công');
      }
    });
  }
 
  deleteItems() {
    if (this.selectedItems.length === 0) {
      this.notificationService.showError('Phải chọn ít nhất một bản ghi');
      return;
    }
    const ids = this.selectedItems.map(item => item.id);
    this.confirmationService.confirm({
      message: 'Bạn có chắc muốn xóa bản ghi này?',
      accept: () => {
        this.deleteItemsConfirmed(ids);
      }
    });
  }
 
  deleteItemsConfirmed(ids: string[]) {
    this.toggleBlockUI(true);
    this.sanPhamService.deleteMultiple(ids).pipe(takeUntil(this.ngUnsubscribe)).subscribe({
      next: () => {
        this.notificationService.showSuccess('Xóa thành công');
        this.loadData();
        this.selectedItems = [];
        this.toggleBlockUI(false);
      },
      error: () => {
        this.toggleBlockUI(false);
      }
    });
  }
 
  private toggleBlockUI(enabled: boolean) {
    if (enabled) {
      this.blockedPanel = true;
    } else {
      setTimeout(() => {
        this.blockedPanel = false;
      }, 1000);
    }
  }
}
