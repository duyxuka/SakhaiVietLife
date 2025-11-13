import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { forkJoin, Subject, takeUntil } from 'rxjs';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { KeHoachCongViecDto } from '@proxy/viet-life/catalog/kpis/ke-hoach-cong-viecs';
import { KeHoachCongViecsService } from '@proxy/viet-life/catalog/kpis';
import { KpiNhanVienDto } from '@proxy/viet-life/catalog/kpis/kpi-nhan-viens';
import { KpiNhanViensService } from '@proxy/viet-life/catalog/kpis';
import { StandaloneSharedModule } from '../../../standaloneshare.module';
import { ValidationMessageComponent } from 'src/app/shared/modules/validation-message/validation-message.component';

@Component({
  selector: 'app-kehoach-congviec-detail',
  styleUrls: ['./kehoachcongviec.component.scss'],
  templateUrl: './kehoachcongviec-detail.component.html',
  standalone: true,
    imports: [
      StandaloneSharedModule,
      ValidationMessageComponent
    ]
})
export class KeHoachCongViecDetailComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject<void>();
  blockedPanel: boolean = false;
  btnDisabled = false;
  public form: FormGroup;

  selectedEntity = {} as KeHoachCongViecDto;
  kpiNhanVienList: any[] = [];

  constructor(
    private kehoachService: KeHoachCongViecsService,
    private fb: FormBuilder,
    private config: DynamicDialogConfig,
    private ref: DynamicDialogRef,
    private utilService: UtilityService,
    private notificationSerivce: NotificationService,
    private kpiService: KpiNhanViensService
  ) {}

  validationMessages = {
    kpiNhanVienId: [{ type: 'required', message: 'Bạn phải chọn KPI nhân viên' }],
    tenKeHoach: [{ type: 'required', message: 'Bạn phải nhập tên kế hoạch' }],
    trongSo: [{ type: 'required', message: 'Bạn phải nhập trọng số' }],
  };

  ngOnInit(): void {
    this.buildForm();
    this.initFormData();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  private buildForm() {
    this.form = this.fb.group({
      kpiNhanVienId: new FormControl(this.selectedEntity.kpiNhanVienId || null, Validators.required),
      tenKeHoach: new FormControl(this.selectedEntity.tenKeHoach || '', Validators.required),
      moTa: new FormControl(this.selectedEntity.moTa || ''),
      ngayBatDau: new FormControl(
        this.selectedEntity.ngayBatDau ? new Date(this.selectedEntity.ngayBatDau) : null
      ),
      ngayKetThuc: new FormControl(
        this.selectedEntity.ngayKetThuc ? new Date(this.selectedEntity.ngayKetThuc) : null
      ),
      trongSo: new FormControl(this.selectedEntity.trongSo || null, Validators.required),
    });
  }

  initFormData() {
    const kpiNhanVienList$ = this.kpiService.getListAll();

    this.toggleBlockUI(true);
    forkJoin({
      kpiNhanVienList: kpiNhanVienList$,
    })
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (response: any) => {
          const list = response.kpiNhanVienList as KpiNhanVienDto[];
          this.kpiNhanVienList = list.map((x) => ({
            value: x.id,
            label: `${x.nam} - ${x.thang} (${x.nhanVienId ?? 'Không xác định'})`,
          }));

          if (this.utilService.isEmpty(this.config.data?.id)) {
            this.toggleBlockUI(false);
          } else {
            this.loadFormDetails(this.config.data?.id);
          }
        },
        error: () => this.toggleBlockUI(false),
      });
  }

  loadFormDetails(id: string) {
    this.toggleBlockUI(true);
    this.kehoachService
      .get(id)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (response: KeHoachCongViecDto) => {
          this.selectedEntity = response;
          this.buildForm();
          this.toggleBlockUI(false);
        },
        error: () => this.toggleBlockUI(false),
      });
  }

  saveChange() {
    this.toggleBlockUI(true);
    if (this.utilService.isEmpty(this.config.data?.id)) {
      this.kehoachService
        .create(this.form.value)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe({
          next: () => {
            this.toggleBlockUI(false);
            this.ref.close(this.form.value);
          },
          error: (err) => {
            this.notificationSerivce.showError(err.error.error.message);
            this.toggleBlockUI(false);
          },
        });
    } else {
      this.kehoachService
        .update(this.config.data?.id, this.form.value)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe({
          next: () => {
            this.toggleBlockUI(false);
            this.ref.close(this.form.value);
          },
          error: (err) => {
            this.notificationSerivce.showError(err.error.error.message);
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
  cancel() {
    this.ref?.close();
  }
}
