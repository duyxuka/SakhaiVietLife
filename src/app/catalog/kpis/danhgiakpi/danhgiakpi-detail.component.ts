import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { forkJoin, Subject, takeUntil } from 'rxjs';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { DanhGiaKpisService } from '@proxy/viet-life/catalog/kpis';
import { DanhGiaKpiDto } from '@proxy/viet-life/catalog/kpis/danh-gia-kpis';
import { KpiNhanViensService } from '@proxy/viet-life/catalog/kpis';
import { KpiNhanVienInListDto } from '@proxy/viet-life/catalog/kpis/kpi-nhan-viens';
import { UsersService, UserInListDto } from '@proxy/viet-life/system/users';
import { StandaloneSharedModule } from '../../standaloneshare.module';
import { ValidationMessageComponent } from 'src/app/shared/modules/validation-message/validation-message.component';

@Component({
  selector: 'app-danhgia-kpi-detail',
  styleUrls: ['./danhgiakpi.component.scss'],
  templateUrl: './danhgiakpi-detail.component.html',
  standalone: true,
    imports: [
      StandaloneSharedModule,
      ValidationMessageComponent
    ]
})
export class DanhGiaKpiDetailComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject<void>();
  blockedPanel = false;
  btnDisabled = false;
  public form: FormGroup;

  // select lists
  kpiNhanVienList: any[] = [];
  nguoiDanhGiaList: any[] = [];
  selectedEntity = {} as DanhGiaKpiDto;

  constructor(
    private fb: FormBuilder,
    private danhGiaKpiService: DanhGiaKpisService,
    private kpiNhanVienService: KpiNhanViensService,
    private userService: UsersService,
    private config: DynamicDialogConfig,
    private ref: DynamicDialogRef,
    private utilService: UtilityService,
    private notificationService: NotificationService
  ) {}

  validationMessages = {
    kpiNhanVienId: [{ type: 'required', message: 'Bạn phải chọn KPI nhân viên' }],
    diemDanhGia: [{ type: 'required', message: 'Bạn phải nhập điểm đánh giá' }],
  };

  ngOnInit(): void {
    this.buildForm();
    this.initFormData();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    if (this.ref) this.ref.close();
  }

  private buildForm() {
    this.form = this.fb.group({
      kpiNhanVienId: new FormControl(this.selectedEntity.kpiNhanVienId || null, Validators.required),
      diemDanhGia: new FormControl(this.selectedEntity.diemDanhGia || null, Validators.required),
      nhanXet: new FormControl(this.selectedEntity.nhanXet || ''),
      nguoiDanhGiaId: new FormControl(this.selectedEntity.nguoiDanhGiaId || null),
    });
  }

  initFormData() {
    const kpiNhanVienList = this.kpiNhanVienService.getListAll();
    const nguoiDanhGiaList = this.userService.getListAll('');

    this.toggleBlockUI(true);

    forkJoin({ kpiNhanVienList, nguoiDanhGiaList })
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (response: any) => {
          // Load select KPI Nhân viên
          const kpis = response.kpiNhanVienList || [];
          kpis.forEach((x: KpiNhanVienInListDto) =>
            this.kpiNhanVienList.push({ value: x.id, label: x.nhanVienId })
          );

          // Load select người đánh giá
          const users = response.nguoiDanhGiaList || [];
          users.forEach((u: UserInListDto) =>
            this.nguoiDanhGiaList.push({ value: u.id, label: u.name })
          );

          // Nếu là edit
          if (this.utilService.isEmpty(this.config.data?.id)) {
            this.toggleBlockUI(false);
          } else {
            this.loadFormDetails(this.config.data.id);
          }
        },
        error: () => this.toggleBlockUI(false),
      });
  }

  loadFormDetails(id: string) {
    this.toggleBlockUI(true);
    this.danhGiaKpiService
      .get(id)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (response: DanhGiaKpiDto) => {
          this.selectedEntity = response;
          this.buildForm();
          this.toggleBlockUI(false);
        },
        error: () => this.toggleBlockUI(false),
      });
  }

  saveChange() {
    this.toggleBlockUI(true);
    const formValue = this.form.value;

    if (this.utilService.isEmpty(this.config.data?.id)) {
      // Create
      this.danhGiaKpiService
        .create(formValue)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe({
          next: () => {
            this.notificationService.showSuccess('Thêm đánh giá KPI thành công');
            this.ref.close(formValue);
            this.toggleBlockUI(false);
          },
          error: (err) => {
            this.notificationService.showError(err.error?.error?.message || 'Lỗi khi thêm mới');
            this.toggleBlockUI(false);
          },
        });
    } else {
      // Update
      this.danhGiaKpiService
        .update(this.config.data.id, formValue)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe({
          next: () => {
            this.notificationService.showSuccess('Cập nhật đánh giá KPI thành công');
            this.ref.close(formValue);
            this.toggleBlockUI(false);
          },
          error: (err) => {
            this.notificationService.showError(err.error?.error?.message || 'Lỗi khi cập nhật');
            this.toggleBlockUI(false);
          },
        });
    }
  }

  private toggleBlockUI(enabled: boolean) {
    if (enabled) {
      this.blockedPanel = true;
      this.btnDisabled = true;
    } else {
      setTimeout(() => {
        this.blockedPanel = false;
        this.btnDisabled = false;
      }, 800);
    }
  }
}
