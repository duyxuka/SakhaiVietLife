import { DangKyTuVanInListDto } from '@/proxy/viet-life/tuong-tac/insurer/dang-ky-tu-vans';
import { DangKyTuVansService } from '@/proxy/viet-life/tuong-tac/insurers';
import { NotificationService } from '@/shared/services/notification.service';
import { StandaloneSharedModule } from '@/standaloneshare.module';
import { PagedResultDto } from '@abp/ng.core';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-dangkytuvan.component',
  standalone: true,
  imports: [
    StandaloneSharedModule
  ],
  templateUrl: './dangkytuvan.component.html'
})
export class DangkytuvanComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject<void>();
  blockedPanel: boolean = false;
  items: DangKyTuVanInListDto[] = [];
  public selectedItems: DangKyTuVanInListDto[] = [];
 
  // Paging variables
  public skipCount: number = 0;
  public maxResultCount: number = 10;
  public totalCount: number;
 
  // Filter
  keyword: string = '';
 
  constructor(
    private dangKyService: DangKyTuVansService,
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
    this.dangKyService
      .getListFilter({
        keyword: this.keyword,
        maxResultCount: this.maxResultCount,
        skipCount: this.skipCount,
      })
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (response: PagedResultDto<DangKyTuVanInListDto>) => {
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
    this.dangKyService.deleteMultiple(ids).pipe(takeUntil(this.ngUnsubscribe)).subscribe({
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
