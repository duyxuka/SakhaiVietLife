import { Component, OnDestroy, OnInit } from '@angular/core';
import { PagedResultDto } from '@abp/ng.core';
import { ThanhPhoInListDto, ThanhPhosService } from '@proxy/viet-life/business/thanh-phos';
import { ConfirmationService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { ThanhPhoDetailComponent } from './thanhpho-detail.component';
import { StandaloneSharedModule } from '../../standaloneshare.module';

@Component({
  selector: 'app-thanh-pho',
  templateUrl: './thanhpho.component.html',
  standalone: true,
  imports: [StandaloneSharedModule]
})
export class ThanhPhoComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject<void>();
  blockedPanel = false;
  items: ThanhPhoInListDto[] = [];
  selectedItems: ThanhPhoInListDto[] = [];
  skipCount = 0;
  maxResultCount = 10;
  totalCount = 0;
  keyword = '';

  constructor(
    private service: ThanhPhosService,
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
    this.service.getListFilter({
        keyword: this.keyword,
        skipCount: this.skipCount,
        maxResultCount: this.maxResultCount
      })
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (res: PagedResultDto<ThanhPhoInListDto>) => {
          this.items = res.items || [];
          this.totalCount = res.totalCount || 0;
          this.toggleBlockUI(false);
        },
        error: () => {
          this.toggleBlockUI(false);
        }
      });
  }

  pageChanged(event: any) {
    this.skipCount = event.first;
    this.maxResultCount = event.rows;
    this.loadData();
  }

  showAddModal() {
    const ref = this.dialogService.open(ThanhPhoDetailComponent, {
      header: 'Thêm thành phố mới',
      modal: true,
      width: '70%',
      dismissableMask: true,
      closable: true
    });

    ref.onClose.subscribe((data: any) => {
      if (data) {
        this.loadData();
        this.notificationService.showSuccess('Thêm thành phố thành công');
        this.selectedItems = [];
      }
    });
  }

  showEditModal() {
    if (this.selectedItems.length !== 1) {
      this.notificationService.showError('Vui lòng chọn 1 thành phố để chỉnh sửa');
      return;
    }

    const id = this.selectedItems[0].id;
    const ref = this.dialogService.open(ThanhPhoDetailComponent, {
      data: { id },
      header: 'Cập nhật thành phố',
      modal: true,
      width: '70%',
      dismissableMask: true,
      closable: true
    });

    ref.onClose.subscribe((data: any) => {
      if (data) {
        this.loadData();
        this.notificationService.showSuccess('Cập nhật thành công');
        this.selectedItems = [];
      }
    });
  }

  deleteItems() {
    if (!this.selectedItems.length) {
      this.notificationService.showError('Vui lòng chọn ít nhất 1 thành phố');
      return;
    }

    const count = this.selectedItems.length;
    this.confirmationService.confirm({
      message: `Bạn có chắc muốn xóa ${count} thành phố này?`,
      header: 'Xác nhận xóa',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        const ids = this.selectedItems.map(x => x.id);
        this.deleteItemsConfirmed(ids);
      }
    });
  }

  private deleteItemsConfirmed(ids: string[]) {
    this.toggleBlockUI(true);
    this.service
      .deleteMultiple(ids)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
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

  // === BLOCK UI ===
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