import { PagedResultDto } from '@abp/ng.core';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ChamCongDto, ChamCongInListDto, ChamCongsService } from '@proxy/viet-life/catalog/cham-congs';
import { ConfirmationService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { Subject, take, takeUntil } from 'rxjs';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { ChamCongDetailComponent } from './chamcong-detail.component';
import { UsersService } from '@proxy/viet-life/system/users';
import { StandaloneSharedModule } from '../../standaloneshare.module';

@Component({
  selector: 'app-chamcong',
  templateUrl: './chamcong.component.html',
  styleUrls: ['./chamcong.component.scss'],
  standalone: true,
  imports: [
    StandaloneSharedModule
  ]
})
export class ChamCongComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject<void>();
  blockedPanel: boolean = false;
  items: ChamCongInListDto[] = [];
  public selectedItems: ChamCongInListDto[] = [];

  //Paging variables
  public skipCount: number = 0;
  public maxResultCount: number = 10;
  public totalCount: number;

  //Filter
  ChamCongs: any[] = [];
  keyword: string = '';
  nhanVienId: string = '';

  userslist: any[] = [];

  constructor(
    private chamcongService: ChamCongsService,
    private dialogService: DialogService,
    private notificationService: NotificationService,
    private confirmationService: ConfirmationService,
    private userService: UsersService
  ) { }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  ngOnInit(): void {
    this.loadData();
    this.loadNhanVienList();
  }
  loadNhanVienList() {
    var key = ''
    this.userService.getListAll(key)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (res: any) => {
          this.userslist = res.map((x: any) => ({
            id: x.id,
            name: x.userName
          }));
        }
      });
  }
  onNhanVienChange() {
    this.skipCount = 0;
    this.loadData();
  }
  loadData() {
    this.toggleBlockUI(true);
    this.chamcongService
      .getListFilter({
        nhanVienId: this.nhanVienId,
        maxResultCount: this.maxResultCount,
        skipCount: this.skipCount,
      })
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (response: PagedResultDto<ChamCongInListDto>) => {
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
    const ref = this.dialogService.open(ChamCongDetailComponent, {
      header: 'Thêm mới phòng ban',
      modal: true,
      width: '70%',
      dismissableMask: true,
      closable: true,
    });

    ref.onClose.subscribe((data: ChamCongDto) => {
      if (data) {
        this.loadData();
        this.notificationService.showSuccess('Thêm phòng ban thành công');
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
    const ref = this.dialogService.open(ChamCongDetailComponent, {
      data: {
        id: id,
      },
      header: 'Cập nhật phòng ban',
      modal: true,
      width: '70%',
      dismissableMask: true,
      closable: true,
    });

    ref.onClose.subscribe((data: ChamCongDto) => {
      if (data) {
        this.loadData();
        this.selectedItems = [];
        this.notificationService.showSuccess('Cập nhật phòng ban thành công');
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
    this.chamcongService.deleteMultiple(ids).pipe(takeUntil(this.ngUnsubscribe)).subscribe({
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
