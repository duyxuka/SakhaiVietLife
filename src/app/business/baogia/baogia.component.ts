import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { BaoGiasService } from '@/proxy/viet-life/business/bao-gias';
import { DialogService } from 'primeng/dynamicdialog';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { ConfirmationService } from 'primeng/api';
import { BaoGiaInListDto } from '@/proxy/viet-life/business/bao-gias-list/bao-gias';
import { StandaloneSharedModule } from '@/standaloneshare.module';
import { BaoGiaDetailComponent } from './baogia-detail.component';

@Component({
  selector: 'app-bao-gia',
  templateUrl: './baogia.component.html',
  standalone: true,
  imports: [StandaloneSharedModule]
})
export class BaoGiaComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject<void>();
  blockedPanel = false;

  items: BaoGiaInListDto[] = [];
  selectedItems: BaoGiaInListDto[] = [];
  skipCount = 0;
  maxResultCount = 10;
  totalCount = 0;
  keyword = '';

  constructor(
    private service: BaoGiasService,
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

    this.service
      .getListFilter({
        keyword: this.keyword,
        skipCount: this.skipCount,
        maxResultCount: this.maxResultCount,
      })
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (res) => {
          this.items = res.items;
          this.totalCount = res.totalCount;
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
    const ref = this.dialogService.open(BaoGiaDetailComponent, { 
      header:'Thêm báo giá', 
      modal: true,
      width: '70%',
      dismissableMask: true,
      closable: true 
    });

    ref.onClose.subscribe(data => { 
      if(data){ 
        this.loadData(); 
        this.notificationService.showSuccess('Thêm báo giá thành công'); 
        this.selectedItems = []; 
      }
    });
  }

  showEditModal() {
    if(this.selectedItems.length !== 1){ 
      this.notificationService.showError('Vui lòng chọn 1 báo giá'); 
      return; 
    }

    const id = this.selectedItems[0].id;

    const ref = this.dialogService.open(BaoGiaDetailComponent, { 
      header:'Cập nhật báo giá', 
      modal: true,
      width: '70%',
      dismissableMask: true,
      closable: true, 
      data:{ id } 
    });

    ref.onClose.subscribe(data => { 
      if(data){ 
        this.loadData(); 
        this.notificationService.showSuccess('Cập nhật thành công'); 
        this.selectedItems = []; 
      }
    });
  }

  deleteItems() {
    if(this.selectedItems.length === 0){ 
      this.notificationService.showError('Vui lòng chọn ít nhất 1 báo giá'); 
      return; 
    }

    const ids = this.selectedItems.map(x => x.id);

    this.confirmationService.confirm({
      message: `Bạn có chắc muốn xóa ${ids.length} báo giá?`,
      header: 'Xác nhận xóa',
      icon: 'pi pi-exclamation-triangle',
      accept: () => this.deleteItemsConfirmed(ids)
    });
  }

  private deleteItemsConfirmed(ids: string[]) {
    this.toggleBlockUI(true);

    this.service.deleteMultiple(ids)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
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
    if (enabled == true) {
      this.blockedPanel = true;
    } else {
      setTimeout(() => {
        this.blockedPanel = false;
      }, 1000);
    }
  }
}
