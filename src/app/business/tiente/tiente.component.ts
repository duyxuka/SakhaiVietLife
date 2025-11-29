import { Component, OnDestroy, OnInit } from '@angular/core';
import { PagedResultDto } from '@abp/ng.core';
import { DialogService } from 'primeng/dynamicdialog';
import { ConfirmationService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { StandaloneSharedModule } from '../../standaloneshare.module';
import { TienTeDto, TienTeInListDto, TienTesService } from '@/proxy/viet-life/business/tien-tes';
import { TienTeDetailComponent } from './tiente-detail.component';

@Component({
  selector: 'app-tiente',
  templateUrl: './tiente.component.html',
  standalone: true,
  imports: [StandaloneSharedModule],
})
export class TienTeComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject<void>();
  items: TienTeInListDto[] = [];
  selectedItems: TienTeInListDto[] = [];

  keyword = '';
  skipCount = 0;
  maxResultCount = 10;
  totalCount: number;

  blockedPanel = false;

  constructor(
    private tienTeService: TienTesService,
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
    this.tienTeService
      .getListFilter({
        keyword: this.keyword,
        skipCount: this.skipCount,
        maxResultCount: this.maxResultCount,
      })
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (response: PagedResultDto<TienTeInListDto>) => {
          this.items = response.items;
          this.totalCount = response.totalCount;
          this.toggleBlockUI(false);
        },
        error: () => this.toggleBlockUI(false),
      });
  }

  pageChanged(event) {
    this.skipCount = event.first;
    this.maxResultCount = event.rows;
    this.loadData();
  }

  showAddModal() {
    const ref = this.dialogService.open(TienTeDetailComponent, {
      header: 'Thêm mới tiền tệ',
      width: '70%',
      modal: true,
      closable: true,
      dismissableMask: true,
    });

    ref.onClose.subscribe((data: TienTeDto) => {
      if (data) {
        this.notificationService.showSuccess('Thêm tiền tệ thành công');
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

    const ref = this.dialogService.open(TienTeDetailComponent, {
      header: 'Cập nhật tiền tệ',
      width: '70%',
      modal: true,
      closable: true,
      dismissableMask: true,
      data: { id },
    });

    ref.onClose.subscribe((data: TienTeDto) => {
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
    this.tienTeService
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
