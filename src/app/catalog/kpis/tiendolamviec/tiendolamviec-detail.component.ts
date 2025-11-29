import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { forkJoin, Subject, takeUntil } from 'rxjs';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import {
  TienDoLamViecsService,
  KpiNhanViensService,
} from '@proxy/viet-life/catalog/kpis';
import {
  TienDoLamViecDto,
} from '@proxy/viet-life/catalog/kpis/tien-do-lam-viecs';
import {
  KpiNhanVienInListDto,
} from '@proxy/viet-life/catalog/kpis/kpi-nhan-viens';
import { StandaloneSharedModule } from '../../../standaloneshare.module';
import { ValidationMessageComponent } from 'src/app/shared/modules/validation-message/validation-message.component';

@Component({
  selector: 'app-tiendo-lamviec-detail',
  styleUrls: ['./tiendolamviec.component.scss'],
  templateUrl: './tiendolamviec-detail.component.html',
  standalone: true,
    imports: [
      StandaloneSharedModule,
      ValidationMessageComponent
    ]
})
export class TienDoLamViecDetailComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject<void>();
  blockedPanel = false;
  btnDisabled = false;
  public form: FormGroup;

  // select list KPI Nhân viên
  kpiNhanVienList: any[] = [];
  selectedEntity = {} as TienDoLamViecDto;

  constructor(
    private fb: FormBuilder,
    private tienDoService: TienDoLamViecsService,
    private kpiNhanVienService: KpiNhanViensService,
    private config: DynamicDialogConfig,
    private ref: DynamicDialogRef,
    private utilService: UtilityService,
    private notificationService: NotificationService
  ) {}

  validationMessages = {
    kpiNhanVienId: [{ type: 'required', message: 'Bạn phải chọn KPI nhân viên' }],
    ngayCapNhat: [{ type: 'required', message: 'Bạn phải chọn ngày cập nhật' }],
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
      ngayCapNhat: new FormControl(this.selectedEntity.ngayCapNhat || new Date(), Validators.required),
      phanTramTienDo: new FormControl(this.selectedEntity.phanTramTienDo || null),
      ghiChu: new FormControl(this.selectedEntity.ghiChu || ''),
    });
  }

  initFormData() {
    const kpiNhanVienList = this.kpiNhanVienService.getListAll();
    this.toggleBlockUI(true);

    forkJoin({ kpiNhanVienList })
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (response: any) => {
          const kpis = response.kpiNhanVienList || [];
          kpis.forEach((x: KpiNhanVienInListDto) =>
            this.kpiNhanVienList.push({ value: x.id, label: x.nhanVienId })
          );

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
    this.tienDoService
      .get(id)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (response: TienDoLamViecDto) => {
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
      this.tienDoService
        .create(formValue)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe({
          next: () => {
            this.notificationService.showSuccess('Thêm tiến độ làm việc thành công');
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
      this.tienDoService
        .update(this.config.data.id, formValue)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe({
          next: () => {
            this.notificationService.showSuccess('Cập nhật tiến độ làm việc thành công');
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
  cancel() {
    this.ref?.close();
  }
}
