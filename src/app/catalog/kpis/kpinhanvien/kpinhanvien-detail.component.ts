import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { forkJoin, Subject, takeUntil } from 'rxjs';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { KpiNhanViensService } from '@proxy/viet-life/catalog/kpis';
import { KpiNhanVienDto } from '@proxy/viet-life/catalog/kpis/kpi-nhan-viens';
import { UserInListDto, UsersService } from '@proxy/viet-life/system/users';
import { StandaloneSharedModule } from '../../../standaloneshare.module';
import { ValidationMessageComponent } from 'src/app/shared/modules/validation-message/validation-message.component';

@Component({
  selector: 'app-kpi-nhanvien-detail',
  styleUrls: ['./kpinhanvien.component.scss'],
  templateUrl: './kpinhanvien-detail.component.html',
  standalone: true,
    imports: [
      StandaloneSharedModule,
      ValidationMessageComponent
    ]
})
export class KpiNhanVienDetailComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject<void>();
  blockedPanel: boolean = false;
  btnDisabled = false;
  public form: FormGroup;

  selectedEntity = {} as KpiNhanVienDto;
  userslist: any[] = [];
  mucXepLoaiList = [
    { label: 'A', value: 'A' },
    { label: 'B', value: 'B' },
    { label: 'C', value: 'C' },
    { label: 'D', value: 'D' },
  ];

  constructor(
    private kpiService: KpiNhanViensService,
    private fb: FormBuilder,
    private config: DynamicDialogConfig,
    private ref: DynamicDialogRef,
    private utilService: UtilityService,
    private notificationSerivce: NotificationService,
    private userService: UsersService
  ) {}

  validationMessages = {
    nhanVienId: [{ type: 'required', message: 'Bạn phải chọn nhân viên' }],
    thang: [{ type: 'required', message: 'Bạn phải nhập tháng' }],
    nam: [{ type: 'required', message: 'Bạn phải nhập năm' }],
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
      nhanVienId: new FormControl(this.selectedEntity.nhanVienId || null, Validators.required),
      thang: new FormControl(this.selectedEntity.thang || null, Validators.required),
      nam: new FormControl(this.selectedEntity.nam || null, Validators.required),
      mucLuongKpi: new FormControl(this.selectedEntity.mucLuongKpi || null),
      phanTramHoanThanh: new FormControl(this.selectedEntity.phanTramHoanThanh || null),
      diemKpi: new FormControl(this.selectedEntity.diemKpi || null),
      mucXepLoai: new FormControl(this.selectedEntity.mucXepLoai || null),
      thuongKpi: new FormControl(this.selectedEntity.thuongKpi || null),
      nguoiDanhGiaId: new FormControl(this.selectedEntity.nguoiDanhGiaId || null),
      ghiChu: new FormControl(this.selectedEntity.ghiChu || '')
    });
  }

  initFormData() {
    const userslist$ = this.userService.getListAll('');

    this.toggleBlockUI(true);
    forkJoin({
      userslist: userslist$,
    })
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (response: any) => {
          const userslist = response.userslist as UserInListDto[];
          this.userslist = userslist.map((x) => ({
            value: x.id,
            label: x.name,
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
    this.kpiService
      .get(id)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (response: KpiNhanVienDto) => {
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
      this.kpiService
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
      this.kpiService
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
