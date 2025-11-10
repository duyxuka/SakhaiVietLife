import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { CheDoNhanViensService, LoaiCheDosService } from '@proxy/viet-life/catalog/che-do-nhan-viens';
import { CheDoNhanVienDto } from '@proxy/viet-life/catalog/che-dos/che-do-nhan-viens';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { forkJoin, Subject, takeUntil } from 'rxjs';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { UserInListDto, UsersService } from '@proxy/viet-life/system/users';
import { PermissionService } from '@abp/ng.core';
import { StandaloneSharedModule } from '../standaloneshare.module';
import { ValidationMessageComponent } from 'src/app/shared/modules/validation-message/validation-message.component';

@Component({
  selector: 'app-chedonhanvien-detail',
  templateUrl: './chedonhanvien-detail.component.html',
  standalone: true,
    imports: [
      StandaloneSharedModule,
      ValidationMessageComponent
    ]
})
export class CheDoNhanVienDetailComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject<void>();
  blockedPanel: boolean = false;
  btnDisabled = false;
  public form: FormGroup;

  //select
  selectedEntity = {} as CheDoNhanVienDto;
  loaiCheDoList: any[] = [];
  isManager = false;
  userslist: any[] = [];

  constructor(
    private chedonhanvienService: CheDoNhanViensService,
    private loaichedoService: LoaiCheDosService,
    private fb: FormBuilder,
    private config: DynamicDialogConfig,
    private ref: DynamicDialogRef,
    private utilService: UtilityService,
    private notificationSerivce: NotificationService,
    private userService: UsersService,
    private permissionService: PermissionService,
  ) { }

  validationMessages = {
    nhanVienId: [{ type: 'required', message: 'Bạn phải chọn nhân viên' }],
    ngayLam: [{ type: 'required', message: 'Bạn phải chọn ngày làm' }],
  };

  ngOnDestroy(): void {
    if (this.ref) {
      this.ref.close();
    }
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  ngOnInit(): void {
    this.buildForm();
    this.initFormData();
    this.permissionService.getGrantedPolicy$('VietLifeAdminCatalog.CheDoNhanVien.Approve')
      .subscribe(isGranted => {
        this.isManager = isGranted;
      });
  }


  initFormData() {
    this.toggleBlockUI(true);

    const loaiCheDoList = this.loaichedoService.getListAll();
    const userslist = this.userService.getListAll('');
    forkJoin({
      loaiCheDoList, userslist
    })
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (response: any) => {
          this.loaiCheDoList = response.loaiCheDoList.map((l: any) => ({
            value: l.id,
            label: l.tenLoaiCheDo,
          }));
          this.userslist = response.userslist.map((l: any) => ({
            value: l.id,
            label: l.hoTen ?? l.name,
          }));
          //Load edit data to form
          if (this.utilService.isEmpty(this.config.data?.id) == true) {
            this.toggleBlockUI(false);
          } else {
            this.loadFormDetails(this.config.data?.id);
          }
        },
        error: () => {
          this.toggleBlockUI(false);
        },
      });
  }

  loadFormDetails(id: string) {
    this.toggleBlockUI(true);
    this.chedonhanvienService
      .get(id)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (response: CheDoNhanVienDto) => {
          this.selectedEntity = response;
          this.buildForm();
          if (!this.isManager) {
            this.form.get('loaiCheDoId')?.disable();
            this.form.get('nguoiDuyetId')?.disable();
            this.form.get('trangThai')?.disable();
          }
          this.toggleBlockUI(false);
        },
        error: () => {
          this.toggleBlockUI(false);
        },
      });
  }

  saveChange() {
    this.toggleBlockUI(true);
    const formData = this.form.value;
    if (!this.isManager) {
      formData.trangThai = false;
      formData.nguoiDuyetId = null;
    }
    if (this.utilService.isEmpty(this.config.data?.id) == true) {
      this.chedonhanvienService
        .create(this.form.value)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe({
          next: () => {
            this.toggleBlockUI(false);

            this.ref.close(this.form.value);
          },
          error: err => {
            this.notificationSerivce.showError(err.error.error.message);

            this.toggleBlockUI(false);
          },
        });
    } else {
      this.chedonhanvienService
        .update(this.config.data?.id, this.form.value)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe({
          next: () => {
            this.toggleBlockUI(false);
            this.ref.close(this.form.value);
          },
          error: err => {
            this.notificationSerivce.showError(err.error.error.message);
            this.toggleBlockUI(false);
          },
        });
    }
  }

  private buildForm() {
    this.form = this.fb.group({
      loaiCheDoId: new FormControl(this.selectedEntity.loaiCheDoId || null, Validators.required),
      soNgay: new FormControl(this.selectedEntity.soNgay || null),
      soCong: new FormControl(this.selectedEntity.soCong || null),
      thanhTien: new FormControl(this.selectedEntity.thanhTien || null),
      lyDo: new FormControl(this.selectedEntity.lyDo || ''),
      ngayBatDau: new FormControl(this.selectedEntity.ngayBatDau ? new Date(this.selectedEntity.ngayBatDau) : null),
      ngayKetThuc: new FormControl(this.selectedEntity.ngayKetThuc ? new Date(this.selectedEntity.ngayKetThuc) : null),
      ghiChu: new FormControl(this.selectedEntity.ghiChu || ''),
      trangThai: new FormControl(this.selectedEntity.trangThai || false),
      nguoiDuyetId: new FormControl(this.selectedEntity.nguoiDuyetId || null),
    });
  }

  private toggleBlockUI(enabled: boolean) {
    if (enabled == true) {
      this.blockedPanel = true;
      this.btnDisabled = true;
    } else {
      setTimeout(() => {
        this.blockedPanel = false;
        this.btnDisabled = false;
      }, 1000);
    }
  }

}
