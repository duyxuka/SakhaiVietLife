import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { forkJoin, Subject, takeUntil } from 'rxjs';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { MucTieuKpisService,KpiNhanViensService,KeHoachCongViecsService } from '@proxy/viet-life/catalog/kpis';
import { KpiNhanVienInListDto } from '@proxy/viet-life/catalog/kpis/kpi-nhan-viens';
import { MucTieuKpiDto } from '@proxy/viet-life/catalog/kpis/muc-tieu-kpis';
import { KeHoachCongViecInListDto } from '@proxy/viet-life/catalog/kpis/ke-hoach-cong-viecs';
import { StandaloneSharedModule } from '../../../standaloneshare.module';
import { ValidationMessageComponent } from 'src/app/shared/modules/validation-message/validation-message.component';

@Component({
  selector: 'app-muctieukpi-detail',
  styleUrls: ['./muctieukpi.component.scss'],
  templateUrl: './muctieukpi-detail.compoment.html',
  standalone: true,
    imports: [
      StandaloneSharedModule,
      ValidationMessageComponent
    ]
})
export class MucTieuKpiDetailComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject<void>();
  blockedPanel = false;
  btnDisabled = false;
  public form: FormGroup;

  // select lists
  kpiNhanVienList: any[] = [];
  keHoachCongViecList: any[] = [];
  selectedEntity = {} as MucTieuKpiDto;

  constructor(
    private fb: FormBuilder,
    private mucTieuKpiService: MucTieuKpisService,
    private kpiNhanVienService: KpiNhanViensService,
    private keHoachCongViecService: KeHoachCongViecsService,
    private config: DynamicDialogConfig,
    private ref: DynamicDialogRef,
    private utilService: UtilityService,
    private notificationService: NotificationService
  ) {}

  validationMessages = {
    kpiNhanVienId: [{ type: 'required', message: 'Bạn phải chọn KPI nhân viên' }],
    tenMucTieu: [{ type: 'required', message: 'Bạn phải nhập tên mục tiêu' }],
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
      keHoachCongViecId: new FormControl(this.selectedEntity.keHoachCongViecId || null),
      tenMucTieu: new FormControl(this.selectedEntity.tenMucTieu || '', Validators.required),
      giaTriMucTieu: new FormControl(this.selectedEntity.giaTriMucTieu || null),
      giaTriThucHien: new FormControl(this.selectedEntity.giaTriThucHien || null),
      donVi: new FormControl(this.selectedEntity.donVi || ''),
      trongSo: new FormControl(this.selectedEntity.trongSo || 0),
    });
  }

  initFormData() {
    const kpiNhanVienList = this.kpiNhanVienService.getListAll();
    const keHoachCongViecList = this.keHoachCongViecService.getListAll();

    this.toggleBlockUI(true);

    forkJoin({ kpiNhanVienList, keHoachCongViecList })
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (response: any) => {
          // Load select KPI Nhân viên
          const kpis = response.kpiNhanVienList || [];
          kpis.forEach((x: KpiNhanVienInListDto) =>
            this.kpiNhanVienList.push({ value: x.id, label: x.nhanVienId})
          );

          // Load select kế hoạch công việc
          const works = response.keHoachCongViecList || [];
          works.forEach((x: KeHoachCongViecInListDto) =>
            this.keHoachCongViecList.push({ value: x.id, label: x.tenKeHoach })
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
    this.mucTieuKpiService
      .get(id)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (response: MucTieuKpiDto) => {
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
      this.mucTieuKpiService
        .create(formValue)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe({
          next: () => {
            this.notificationService.showSuccess('Thêm mục tiêu KPI thành công');
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
      this.mucTieuKpiService
        .update(this.config.data.id, formValue)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe({
          next: () => {
            this.notificationService.showSuccess('Cập nhật mục tiêu KPI thành công');
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
