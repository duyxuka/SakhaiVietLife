import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LuongNhanVienDto, LuongNhanViensService } from '@proxy/viet-life/catalog/luong-nhan-viens';
import { UserInListDto, UsersService } from '@proxy/viet-life/system/users';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject } from 'rxjs';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { StandaloneSharedModule } from '../../standaloneshare.module';
import { ValidationMessageComponent } from 'src/app/shared/modules/validation-message/validation-message.component';

@Component({
  selector: 'app-luong-detail',
  templateUrl: './luongnhanvien-detail.component.html',
  standalone: true,
  imports: [
    StandaloneSharedModule,
    ValidationMessageComponent
  ]
})
export class LuongNhanVienDetailComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject<void>();
  blockedPanel = false;
  btnDisabled = false;
  form: FormGroup;
  selectedEntity = {} as LuongNhanVienDto;
  userslist: any[] = [];
  thangOptions = Array.from({ length: 12 }, (_, i) => ({ label: `Tháng ${i + 1}`, value: i + 1 }));

  constructor(
    private luongService: LuongNhanViensService,
    private fb: FormBuilder,
    private config: DynamicDialogConfig,
    private ref: DynamicDialogRef,
    private utilService: UtilityService,
    private notificationService: NotificationService,
    private userService: UsersService,
    private cdr: ChangeDetectorRef
  ) { }

  validationMessages = {
    nhanVienId: [{ type: 'required', message: 'Bạn phải chọn nhân viên' }],
    thang: [{ type: 'required', message: 'Bạn phải chọn tháng' }],
    nam: [{ type: 'required', message: 'Bạn phải nhập năm' }],
  };

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  ngOnInit(): void {
    this.buildForm();
    this.loadNhanVienList();
    if (this.config.data?.id) {
      this.loadFormDetails(this.config.data.id);
    }
  }

  loadNhanVienList() {
    this.userService.getListAll('').subscribe((res: UserInListDto[]) => {
      this.userslist = res.map(u => ({
        label: u.hoTen || u.userName,
        value: u.id,
      }));
    });
  }

  loadFormDetails(id: string) {
    this.toggleBlockUI(true);
    this.luongService.get(id).subscribe({
      next: (res: LuongNhanVienDto) => {
        this.selectedEntity = res;
        this.buildForm();
        this.toggleBlockUI(false);
      },
      error: () => this.toggleBlockUI(false),
    });
  }

  buildForm() {
    this.form = this.fb.group({
      nhanVienId: [this.selectedEntity.nhanVienId || null, Validators.required],
      thang: [this.selectedEntity.thang || null, Validators.required],
      nam: [this.selectedEntity.nam || null, Validators.required],
      luongTheoNgayCong: [this.selectedEntity.luongTheoNgayCong || null],
      phuCap: [this.selectedEntity.phuCap || null],
      thuongKpi: [this.selectedEntity.thuongKpi || null],
      thuongKhac: [this.selectedEntity.thuongKhac || null],
      khauTru: [this.selectedEntity.khauTru || null],
      congTruCheDo: [this.selectedEntity.congTruCheDo || null],
      ghiChu: [this.selectedEntity.ghiChu || null],
    });
  }

  saveChange() {
    if (this.form.invalid) return;

    this.toggleBlockUI(true);
    const request = this.config.data?.id
      ? this.luongService.update(this.config.data.id, this.form.value)
      : this.luongService.create(this.form.value);

    request.subscribe({
      next: () => {
        this.toggleBlockUI(false);
        this.ref.close(this.form.value);
      },
      error: (err) => {
        this.notificationService.showError(err.error?.error?.message);
        this.toggleBlockUI(false);
      },
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
