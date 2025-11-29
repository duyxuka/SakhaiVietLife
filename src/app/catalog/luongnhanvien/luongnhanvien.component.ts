import { Component, OnDestroy, OnInit } from '@angular/core';
import { PagedResultDto } from '@abp/ng.core';
import { LuongNhanVienInListDto, LuongNhanViensService } from '@proxy/viet-life/catalog/luong-nhan-viens';
import { ConfirmationService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { LuongNhanVienDetailComponent } from './luongnhanvien-detail.component';
import { UsersService } from '@proxy/viet-life/system/users';
import { StandaloneSharedModule } from '../../standaloneshare.module';

@Component({
  selector: 'app-luongnhanvien',
  templateUrl: './luongnhanvien.component.html',
  standalone: true,
      imports: [
        StandaloneSharedModule
      ]
})
export class LuongNhanvienComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject<void>();
  blockedPanel = false;
  items: LuongNhanVienInListDto[] = [];
  selectedItems: LuongNhanVienInListDto[] = [];
  totalCount = 0;
  skipCount = 0;
  maxResultCount = 10;

  // Filter
  nhanVienId = '';
  thang = null;
  nam = new Date().getFullYear();
  userslist: any[] = [];
  thangOptions = Array.from({ length: 12 }, (_, i) => ({ label: `Tháng ${i + 1}`, value: i + 1 }));

  constructor(
    private luongService: LuongNhanViensService,
    private dialogService: DialogService,
    private notificationService: NotificationService,
    private confirmationService: ConfirmationService,
    private userService: UsersService
  ) {}

  ngOnInit(): void {
    this.loadNhanVienList();
    this.loadData();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  loadNhanVienList() {
    this.userService.getListAll('').subscribe((res) => {
      this.userslist = res.map(u => ({
        label: u.hoTen || u.userName,
        value: u.id,
      }));
    });
  }

  onFilterChange() {
    this.skipCount = 0;
    this.loadData();
  }

  loadData() {
    this.toggleBlockUI(true);
    this.luongService.getListFilter({
      keyword: '',
      nhanVienId: this.nhanVienId || undefined,
      thang: this.thang,
      nam: this.nam,
      skipCount: this.skipCount,
      maxResultCount: this.maxResultCount,
    }).subscribe({
      next: (res: PagedResultDto<LuongNhanVienInListDto>) => {
        this.items = res.items;
        this.totalCount = res.totalCount;
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
    const ref = this.dialogService.open(LuongNhanVienDetailComponent, {
      header: 'Thêm bảng lương',
      width: '80%',
    });
    ref.onClose.subscribe((res) => {
      if (res) {
        this.loadData();
        this.notificationService.showSuccess('Thêm thành công');
      }
    });
  }

  showEditModal() {
    if (!this.selectedItems[0]) return;
    const ref = this.dialogService.open(LuongNhanVienDetailComponent, {
      data: { id: this.selectedItems[0].id },
      header: 'Sửa bảng lương',
      width: '80%',
    });
    ref.onClose.subscribe((res) => {
      if (res) {
        this.loadData();
        this.notificationService.showSuccess('Cập nhật thành công');
      }
    });
  }

  deleteItems() {
    if (this.selectedItems.length === 0) {
      this.notificationService.showError('Chọn ít nhất 1 bản ghi');
      return;
    }
    this.confirmationService.confirm({
      message: 'Xóa các bản ghi đã chọn?',
      accept: () => {
        const ids = this.selectedItems.map(x => x.id);
        this.luongService.deleteMultiple(ids).subscribe({
          next: () => {
            this.notificationService.showSuccess('Xóa thành công');
            this.loadData();
            this.selectedItems = [];
          },
        });
      },
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