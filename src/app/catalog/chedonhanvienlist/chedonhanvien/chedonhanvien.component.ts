import { PagedResultDto } from '@abp/ng.core';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { CheDoNhanVienDto, CheDoNhanVienInListDto } from '@proxy/viet-life/catalog/che-dos/che-do-nhan-viens';
import { ConfirmationService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { CheDoNhanVienDetailComponent } from './chedonhanvien-detail.component';
import { CheDoNhanViensService } from '@proxy/viet-life/catalog/che-do-nhan-viens';
import { StandaloneSharedModule } from '../../../standaloneshare.module';

@Component({
  selector: 'app-chedonhanvien',
  templateUrl: './chedonhanvien.component.html',
  styleUrls: ['./chedonhanvien.component.scss'],
  standalone: true,
    imports: [
      StandaloneSharedModule
    ]
})
export class CheDoNhanVienComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject<void>();
  blockedPanel = false;
  items: CheDoNhanVienInListDto[] = [];
  selectedItems: CheDoNhanVienInListDto[] = [];

  // Paging
  skipCount = 0;
  maxResultCount = 10;
  totalCount: number = 0;

  constructor(
    private chedoNhanVienService: CheDoNhanViensService,
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

  onNhanVienChange() {
    this.skipCount = 0;
    this.loadData();
  }

  loadData() {
    this.toggleBlockUI(true);
    this.chedoNhanVienService
      .getListFilter({
        maxResultCount: this.maxResultCount,
        skipCount: this.skipCount,
      })
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (response: PagedResultDto<CheDoNhanVienInListDto>) => {
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
    const ref = this.dialogService.open(CheDoNhanVienDetailComponent, {
      header: 'Thêm mới chế độ nhân viên',
      modal: true,
      width: '70%',
      dismissableMask: true,
      closable: true,
    });

    ref.onClose.subscribe((data: CheDoNhanVienDto) => {
      if (data) {
        this.loadData();
        this.notificationService.showSuccess('Thêm chế độ nhân viên thành công');
        this.selectedItems = [];
      }
    });
  }

  showEditModal() {
    if (this.selectedItems.length !== 1) {
      this.notificationService.showError('Bạn phải chọn đúng 1 bản ghi để sửa');
      return;
    }

    const id = this.selectedItems[0].id;
    const ref = this.dialogService.open(CheDoNhanVienDetailComponent, {
      data: { id },
      header: 'Cập nhật chế độ nhân viên',
      modal: true,
      width: '70%',
      dismissableMask: true,
      closable: true,
    });

    ref.onClose.subscribe((data: CheDoNhanVienDto) => {
      if (data) {
        this.loadData();
        this.notificationService.showSuccess('Cập nhật thành công');
        this.selectedItems = [];
      }
    });
  }

  deleteItems() {
    if (this.selectedItems.length == 0) {
      this.notificationService.showError('Phải chọn ít nhất một bản ghi');
      return;
    }

    const ids = this.selectedItems.map(x => x.id);
    this.confirmationService.confirm({
      message: 'Bạn có chắc muốn xóa các bản ghi đã chọn?',
      accept: () => this.deleteItemsConfirmed(ids),
    });
  }

  deleteItemsConfirmed(ids: string[]) {
    this.toggleBlockUI(true);
    this.chedoNhanVienService.deleteMultiple(ids)
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
    if (enabled == true) {
      this.blockedPanel = true;
    } else {
      setTimeout(() => {
        this.blockedPanel = false;
      }, 1000);
    }
  }
}
