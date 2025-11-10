import { PagedResultDto } from '@abp/ng.core';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  PhuCapNhanVienDto,
  PhuCapNhanVienInListDto,
  PhuCapNhanViensService,
} from '@proxy/viet-life/catalog/phu-cap-nhan-viens';
import { ChucVusService, ChucVuInListDto } from '@proxy/viet-life/catalog/chuc-vus';
import { ConfirmationService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { Subject, forkJoin, takeUntil } from 'rxjs';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { PhuCapNhanVienDetailComponent } from './phucapnhanvien-detail.component';
import { StandaloneSharedModule } from '../standaloneshare.module';

@Component({
  selector: 'app-phucapnhanvien',
  templateUrl: './phucapnhanvien.component.html',
  styleUrls: ['./phucapnhanvien.component.scss'],
  standalone: true,
      imports: [
        StandaloneSharedModule
      ]
})
export class PhuCapNhanVienComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject<void>();
  blockedPanel = false;

  items: PhuCapNhanVienInListDto[] = [];
  selectedItems: PhuCapNhanVienInListDto[] = [];

  //Paging
  skipCount = 0;
  maxResultCount = 10;
  totalCount = 0;

  //Filter
  keyword = '';
  chucVuId: string | null = null;
  chucVuList: any[] = [];

  constructor(
    private phuCapNhanVienService: PhuCapNhanViensService,
    private chucVuService: ChucVusService,
    private dialogService: DialogService,
    private notificationService: NotificationService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.initselect();
    this.loadData();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  private initselect() {
    this.chucVuService.getListAll().pipe(takeUntil(this.ngUnsubscribe)).subscribe({
      next: (res) => {
        this.chucVuList = res.map((x: ChucVuInListDto) => ({
          label: x.tenChucVu,
          value: x.id,
        }));
      },
    });
  }

  loadData() {
    this.toggleBlockUI(true);
    this.phuCapNhanVienService
      .getListFilter({
        keyword: this.keyword,
        chucVuId: this.chucVuId,
        maxResultCount: this.maxResultCount,
        skipCount: this.skipCount,
      })
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (res: PagedResultDto<PhuCapNhanVienInListDto>) => {
          this.items = res.items;
          this.totalCount = res.totalCount;
          this.toggleBlockUI(false);
        },
        error: () => this.toggleBlockUI(false),
      });
  }

  pageChanged(event: any): void {
    this.skipCount = event.first;
    this.maxResultCount = event.rows;
    this.loadData();
  }

  showAddModal() {
    const ref = this.dialogService.open(PhuCapNhanVienDetailComponent, {
      header: 'Thêm mới phụ cấp nhân viên',
      width: '60%',
    });

    ref.onClose.subscribe((data: PhuCapNhanVienDto) => {
      if (data) {
        this.notificationService.showSuccess('Thêm phụ cấp thành công');
        this.loadData();
        this.selectedItems = [];
      }
    });
  }

  showEditModal() {
    if (this.selectedItems.length !== 1) {
      this.notificationService.showError('Vui lòng chọn một bản ghi để sửa');
      return;
    }

    const id = this.selectedItems[0].id;
    const ref = this.dialogService.open(PhuCapNhanVienDetailComponent, {
      data: { id },
      header: 'Cập nhật phụ cấp nhân viên',
      width: '60%',
    });

    ref.onClose.subscribe((data: PhuCapNhanVienDto) => {
      if (data) {
        this.notificationService.showSuccess('Cập nhật phụ cấp thành công');
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
      message: 'Bạn có chắc muốn xóa các phụ cấp này?',
      accept: () => this.deleteItemsConfirmed(ids),
    });
  }

  private deleteItemsConfirmed(ids: string[]) {
    this.toggleBlockUI(true);
    this.phuCapNhanVienService
      .deleteMultiple(ids)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: () => {
          this.notificationService.showSuccess('Xóa phụ cấp thành công');
          this.loadData();
          this.selectedItems = [];
          this.toggleBlockUI(false);
        },
        error: () => this.toggleBlockUI(false),
      });
  }

  private toggleBlockUI(enabled: boolean) {
    this.blockedPanel = enabled;
  }
}
