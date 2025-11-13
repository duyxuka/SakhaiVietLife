import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { LichLamViecDto, LichLamViecsService } from '@proxy/viet-life/catalog/lich-lam-viecs';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { ValidationMessageComponent } from 'src/app/shared/modules/validation-message/validation-message.component';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { StandaloneSharedModule } from '../../standaloneshare.module';

@Component({
  selector: 'app-lichlamviec-detail',
  templateUrl: './lichlamviec-detail.component.html',
  standalone: true,
    imports: [
      StandaloneSharedModule,
      ValidationMessageComponent
    ]
})
export class LichLamViecDetailComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject<void>();
  blockedPanel: boolean = false;
  btnDisabled = false;
  public form: FormGroup;

  //select
  selectedEntity = {} as LichLamViecDto;
  caLamOptions = [
    { label: 'Full', value: 'Full' },
    { label: 'Ca sáng', value: 'Ca sáng' },
    { label: 'Ca chiều', value: 'Ca chiều' },
  ];

  constructor(
    private lichlamviecService: LichLamViecsService,
    private fb: FormBuilder,
    private config: DynamicDialogConfig,
    private ref: DynamicDialogRef,
    private utilService: UtilityService,
    private notificationSerivce: NotificationService
  ) { }

  validationMessages = {
    thang: [{ type: 'required', message: 'Bạn phải nhập tháng' }],
    nam: [{ type: 'required', message: 'Bạn phải nhập năm' }],
    ngayLam: [{ type: 'required', message: 'Bạn phải nhập ngày làm' }],
    ngayNghi: [{ type: 'required', message: 'Bạn phải nhập ngày nghỉ' }],
    caLamMacDinh: [{ type: 'required', message: 'Bạn phải nhập ca làm' }],
    gioBatDauMacDinh: [{ type: 'required', message: 'Bạn phải nhập giờ bắt đầu' }],
    gioKetThucMacDinh: [{ type: 'required', message: 'Bạn phải nhập giờ kết thúc' }],
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
  }


  initFormData() {
    this.toggleBlockUI(true);
    //Load edit data to form
    if (this.utilService.isEmpty(this.config.data?.id) == true) {
      this.toggleBlockUI(false);
    } else {
      this.loadFormDetails(this.config.data?.id);
    }
  }

  loadFormDetails(id: string) {
    this.toggleBlockUI(true);
    this.lichlamviecService
      .get(id)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (response: LichLamViecDto) => {
          this.selectedEntity = {
            ...response,
            ngayLam: this.parseNgayToArray(response.ngayLam, response.thang, response.nam) as any,
            ngayNghi: this.parseNgayToArray(response.ngayNghi, response.thang, response.nam) as any,
            gioBatDauMacDinh: this.parseTimeToDate(response.gioBatDauMacDinh) as any,
            gioKetThucMacDinh: this.parseTimeToDate(response.gioKetThucMacDinh) as any,
          };
          this.buildForm();
          this.toggleBlockUI(false);
        },
        error: () => {
          this.toggleBlockUI(false);
        },
      });
  }

  saveChange() {
    this.toggleBlockUI(true);
    const formValue = this.form.value;
    const dto = {
      ...formValue,
      ngayLam: this.parseDateArrayToString(formValue.ngayLam),
      ngayNghi: this.parseDateArrayToString(formValue.ngayNghi),
      gioBatDauMacDinh: this.formatTime(formValue.gioBatDauMacDinh),
      gioKetThucMacDinh: this.formatTime(formValue.gioKetThucMacDinh),
    };

    if (this.utilService.isEmpty(this.config.data?.id) == true) {
      this.lichlamviecService
        .create(dto)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe({
          next: () => {
            this.toggleBlockUI(false);

            this.ref.close(dto);
          },
          error: err => {
            this.notificationSerivce.showError(err.error.error.message);

            this.toggleBlockUI(false);
          },
        });
    } else {
      this.lichlamviecService
        .update(this.config.data?.id, dto)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe({
          next: () => {
            this.toggleBlockUI(false);
            this.ref.close(dto);
          },
          error: err => {
            this.notificationSerivce.showError(err.error.error.message);
            this.toggleBlockUI(false);
          },
        });
    }
  }

  private parseNgayToArray(ngayChuoi: string | undefined, thang?: number, nam?: number): Date[] {
    if (!ngayChuoi) return [];
    const month = (thang ?? new Date().getMonth() + 1) - 1; // JS tháng bắt đầu từ 0
    const year = nam ?? new Date().getFullYear();
    return ngayChuoi
      .split(',')
      .map((n) => parseInt(n.trim()))
      .filter((n) => !isNaN(n))
      .map((day) => new Date(year, month, day));
  }

  // 🧠 Convert Date[] -> chuỗi "1,2,3"
  private parseDateArrayToString(dates: Date[]): string {
    if (!dates || !Array.isArray(dates)) return '';
    return dates
      .map((d) => d.getDate())     // Lấy ra số ngày
      .sort((a, b) => a - b)       // Sắp xếp tăng dần
      .join(',');
  }

  // 🧠 Convert TimeSpan "08:30:00" -> Date object
  private parseTimeToDate(timeString: string | undefined): Date | null {
    if (!timeString) return null;
    const [h, m, s] = timeString.split(':').map((t) => parseInt(t, 10));
    const date = new Date();
    date.setHours(h, m, s || 0);
    return date;
  }

  // 🧠 Convert Date -> "HH:mm:ss"
  private formatTime(date: Date | null): string | null {
    if (!date) return null;
    const hh = date.getHours().toString().padStart(2, '0');
    const mm = date.getMinutes().toString().padStart(2, '0');
    const ss = date.getSeconds().toString().padStart(2, '0');
    return `${hh}:${mm}:${ss}`;
  }

  private buildForm() {
    this.form = this.fb.group({
      thang: new FormControl(this.selectedEntity.thang || null, Validators.required),
      nam: new FormControl(this.selectedEntity.nam || null, Validators.required),
      ngayLam: new FormControl(this.selectedEntity.ngayLam || []),
      ngayNghi: new FormControl(this.selectedEntity.ngayNghi || []),
      caLamMacDinh: new FormControl(this.selectedEntity.caLamMacDinh || ''),
      gioBatDauMacDinh: new FormControl(this.selectedEntity.gioBatDauMacDinh || null),
      gioKetThucMacDinh: new FormControl(this.selectedEntity.gioKetThucMacDinh || null),
      ghiChu: new FormControl(this.selectedEntity.ghiChu || ''),
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
  cancel() {
    this.ref?.close();
  }
}
