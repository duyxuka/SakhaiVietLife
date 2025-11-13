import { PagedResultDto } from '@abp/ng.core';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { LichLamViecDto, LichLamViecInListDto, LichLamViecsService } from '@proxy/viet-life/catalog/lich-lam-viecs';
import { ConfirmationService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { Subject, take, takeUntil } from 'rxjs';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { LichLamViecDetailComponent } from './lichlamviec-detail.component';
import { StandaloneSharedModule } from '../../standaloneshare.module';

@Component({
  selector: 'app-lichlamviec',
  templateUrl: './lichlamviec.component.html',
  styleUrls: ['./lichlamviec.component.scss'],
  standalone: true,
      imports: [
        StandaloneSharedModule
      ]
})
export class LichLamViecComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject<void>();
  blockedPanel: boolean = false;
  items: LichLamViecInListDto[] = [];
  public selectedItems: LichLamViecInListDto[] = [];


  //Paging variables
  public skipCount: number = 0;
  public maxResultCount: number = 10;
  public totalCount: number;

  //Filter
  LichLamViecs: any[] = [];
  rangeDates: Date[] = [];

  constructor(
    private lichlamviecService: LichLamViecsService,
    private dialogService: DialogService,
    private notificationService: NotificationService,
    private confirmationService: ConfirmationService
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

    const now = new Date();
    let startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    let endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    // Nếu người dùng chọn khoảng ngày
    if (this.rangeDates && this.rangeDates.length === 2) {
      startDate = this.rangeDates[0];
      endDate = this.rangeDates[1];
    }

    this.lichlamviecService
      .getListFilter({
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        maxResultCount: this.maxResultCount,
        skipCount: this.skipCount,
      })
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (response: PagedResultDto<LichLamViecInListDto>) => {
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
    const ref = this.dialogService.open(LichLamViecDetailComponent, {
      header: 'Thêm mới lịch làm việc',
      modal: true,
      width: '70%',
      dismissableMask: true,
      closable: true,
    });

    ref.onClose.subscribe((data: LichLamViecDto) => {
      if (data) {
        this.loadData();
        this.notificationService.showSuccess('Thêm lịch làm việc thành công');
        this.selectedItems = [];
      }
    });
  }

  showEditModal() {
    if (this.selectedItems.length == 0) {
      this.notificationService.showError('Bạn phải chọn một bản ghi');
      return;
    }
    const id = this.selectedItems[0].id;
    const ref = this.dialogService.open(LichLamViecDetailComponent, {
      data: {
        id: id,
      },
      header: 'Cập nhật lịch làm việc',
      modal: true,
      width: '70%',
      dismissableMask: true,
      closable: true,
    });

    ref.onClose.subscribe((data: LichLamViecDto) => {
      if (data) {
        this.loadData();
        this.selectedItems = [];
        this.notificationService.showSuccess('Cập nhật lịch làm việc thành công');
      }
    });
  }
  deleteItems() {
    if (this.selectedItems.length == 0) {
      this.notificationService.showError("Phải chọn ít nhất một bản ghi");
      return;
    }
    var ids = [];
    this.selectedItems.forEach(element => {
      ids.push(element.id);
    });
    this.confirmationService.confirm({
      message: 'Bạn có chắc muốn xóa bản ghi này?',
      accept: () => {
        this.deleteItemsConfirmed(ids);
      }
    })
  }

  deleteItemsConfirmed(ids: string[]) {
    this.toggleBlockUI(true);
    this.lichlamviecService.deleteMultiple(ids).pipe(takeUntil(this.ngUnsubscribe)).subscribe({
      next: () => {
        this.notificationService.showSuccess("Xóa thành công");
        this.loadData();
        this.selectedItems = [];
        this.toggleBlockUI(false);
      },
      error: () => {
        this.toggleBlockUI(false);
      }
    })
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
