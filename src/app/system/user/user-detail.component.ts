import { Component, OnInit, OnDestroy, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { PanelModule } from 'primeng/panel';
import { InputTextModule } from 'primeng/inputtext';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';
import { InputNumberModule } from 'primeng/inputnumber';
import { BlockUIModule } from 'primeng/blockui';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { takeUntil } from 'rxjs';
import { Subject, forkJoin } from 'rxjs';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ValidationMessageComponent } from 'src/app/shared/modules/validation-message/validation-message.component';
import { UserDto, UsersService } from '@/proxy/viet-life/system/users';
import { RoleDto, RolesService } from '@/proxy/viet-life/system/roles';
import { ChucVuInListDto, ChucVusService } from '@/proxy/viet-life/catalog/chuc-vus';
import { PhongBanInListDto, PhongBansService } from '@/proxy/viet-life/catalog/phong-bans';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PanelModule,
    InputTextModule,
    DatePickerModule,
    SelectModule,
    InputNumberModule,
    BlockUIModule,
    ProgressSpinnerModule,
    ValidationMessageComponent
  ],
})
export class UserDetailComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject<void>();

  // Default
  public blockedPanelDetail: boolean = false;
  public form: FormGroup;
  public title: string;
  public btnDisabled = false;
  public saveBtnName: string;
  public roles: any[] = [];
  public countries: any[] = [];
  public provinces: any[] = [];
  public phongBanList: any[] = [];
  public chucVuList: any[] = [];
  selectedEntity = {} as UserDto;
  public avatarImage;
  public GioiTinh = [
    { label: 'Nam', value: true },
    { label: 'Nữ', value: false }
  ];

  formSavedEventEmitter: EventEmitter<any> = new EventEmitter();

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private roleService: RolesService,
    private userService: UsersService,
    public authService: AuthService,
    private utilService: UtilityService,
    private fb: FormBuilder,
    private chucVuService: ChucVusService,
    private phongBanService: PhongBansService
  ) { }
  ngOnDestroy(): void {
    if (this.ref) {
      this.ref.close();
    }
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
  // Validate
  validationMessages = {
    name: [{ type: 'required', message: 'Bạn phải nhập tên' }],
    surname: [{ type: 'required', message: 'Bạn phải nhập họ' }],
    email: [{ type: 'required', message: 'Bạn phải nhập email' }],
    userName: [{ type: 'required', message: 'Bạn phải nhập tài khoản' }],
    password: [
      { type: 'required', message: 'Bạn phải nhập mật khẩu' },
      {
        type: 'pattern',
        message: 'Mật khẩu ít nhất 8 ký tự, ít nhất 1 số, 1 ký tự đặc biệt, và một chữ hoa',
      },
    ],
    phoneNumber: [
      { type: 'required', message: 'Bạn phải nhập số điện thoại' },
      { type: 'pattern', message: 'Số điện thoại phải có 10–11 chữ số' },
    ],
    maNv: [{ type: 'required', message: 'Bạn phải nhập mã nhân viên' }],
    hoTen: [{ type: 'required', message: 'Bạn phải nhập họ tên' }],
    luongCoBan: [{ type: 'required', message: 'Bạn phải nhập lương cơ bản' }],
    donGiaCong: [{ type: 'required', message: 'Bạn phải nhập đơn giá công' }],
    ngaySinh: [{ type: 'required', message: 'Bạn phải chọn ngày sinh' }],
    gioiTinh: [{ type: 'required', message: 'Bạn phải chọn giới tính' }],
    soCmnd: [{ type: 'pattern', message: 'Số CMND/CCCD không hợp lệ' }],
    phongBanId: [{ type: 'required', message: 'Bạn phải chọn phòng ban' }],
    chucVuId: [{ type: 'required', message: 'Bạn phải chọn chức vụ' }],
    ngayVaoLam: [{ type: 'required', message: 'Bạn phải chọn ngày vào làm' }],
    trangThai: [{ type: 'required', message: 'Bạn phải chọn trạng thái' }],
  };

  ngOnInit() {
    //Init form
    this.buildForm();
    //Load data to form
    var roles = this.roleService.getListAll();
    var phongBanList = this.phongBanService.getListAll();
    var chucVuList = this.chucVuService.getListAll();
    this.toggleBlockUI(true);
    forkJoin({
      roles,
      phongBanList,
      chucVuList
    })
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (repsonse: any) => {
          //Push categories to select list
          var roles = repsonse.roles as RoleDto[];
          var phongBanList = repsonse.phongBanList as PhongBanInListDto[];
          var chucVuList = repsonse.chucVuList as ChucVuInListDto[];

          roles.forEach(element => {
            this.roles.push({
              value: element.id,
              label: element.name,
            });
          });
          phongBanList.forEach(element => {
            this.phongBanList.push({
              value: element.id,
              label: element.tenPhongBan,
            });
          });
          chucVuList.forEach(element => {
            this.chucVuList.push({
              value: element.id,
              label: element.tenChucVu,
            });
          });

          console.log(this.phongBanList)
          console.log(this.chucVuList)
          if (this.utilService.isEmpty(this.config.data?.id) == false) {
            this.loadFormDetails(this.config.data?.id);
          } else {
            this.setMode('create');
            this.toggleBlockUI(false);
          }
        },
        error: () => {
          this.toggleBlockUI(false);
        },
      });
  }
  loadFormDetails(id: string) {
    this.userService
      .get(id)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (response: UserDto) => {
          this.selectedEntity = response;
          this.buildForm();
          this.setMode('update');

          this.toggleBlockUI(false);
        },
        error: () => {
          this.toggleBlockUI(false);
        },
      });
  }

  saveChange() {
    this.toggleBlockUI(true);

    this.saveData();
  }

  private saveData() {
    this.toggleBlockUI(true);
    console.log(this.form.value);
    if (this.utilService.isEmpty(this.config.data?.id)) {
      this.userService
        .create(this.form.value)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe({
          next: () => {
            this.ref.close(this.form.value);
            this.toggleBlockUI(false);
          },
          error: () => {
            this.toggleBlockUI(false);
          },
        });
    } else {
      this.userService
        .update(this.config.data?.id, this.form.value)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe({
          next: () => {
            this.toggleBlockUI(false);

            this.ref.close(this.form.value);
          },
          error: () => {
            this.toggleBlockUI(false);
          },
        });
    }
  }
  private toggleBlockUI(enabled: boolean) {
    if (enabled == true) {
      this.btnDisabled = true;
      this.blockedPanelDetail = true;
    } else {
      setTimeout(() => {
        this.btnDisabled = false;
        this.blockedPanelDetail = false;
      }, 1000);
    }
  }

  setMode(mode: string) {
    if (mode == 'update') {
      this.form.controls['userName'].clearValidators();
      this.form.controls['userName'].disable();
      this.form.controls['email'].clearValidators();
      this.form.controls['email'].disable();
      this.form.controls['password'].clearValidators();
      this.form.controls['password'].disable();
      this.form.controls['maNv'].disable();
    } else if (mode == 'create') {
      this.form.controls['userName'].addValidators(Validators.required);
      this.form.controls['userName'].enable();
      this.form.controls['email'].addValidators(Validators.required);
      this.form.controls['email'].enable();
      this.form.controls['password'].addValidators(Validators.required);
      this.form.controls['password'].enable();
    }
  }
  buildForm() {
    console.log(this.form)
    this.form = this.fb.group({
      name: new FormControl(this.selectedEntity.name || null, Validators.required),
      surname: new FormControl(this.selectedEntity.surname || null, Validators.required),
      userName: new FormControl(this.selectedEntity.userName || null, Validators.required),
      email: new FormControl(this.selectedEntity.email || null, Validators.required),
      phoneNumber: new FormControl(this.selectedEntity.phoneNumber || null,
        Validators.compose([
          Validators.required,
          Validators.pattern('^[0-9]{10,11}$') // số điện thoại 10–11 chữ số
        ])
      ),
      password: new FormControl(
        null,
        Validators.compose([
          Validators.required,
          Validators.pattern(
            '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-zd$@$!%*?&].{8,}$'
          ),
        ])
      ),
      maNv: new FormControl(this.selectedEntity.maNv || null, Validators.required),
      hoTen: new FormControl(this.selectedEntity.hoTen || null, Validators.required),
      ngaySinh: new FormControl(this.selectedEntity.ngaySinh ? new Date(this.selectedEntity.ngaySinh) : null),
      luongCoBan: new FormControl(this.selectedEntity.luongCoBan || null),
      donGiaCong: new FormControl(this.selectedEntity.donGiaCong || null),
      gioiTinh: new FormControl(this.selectedEntity.gioiTinh ?? true), // true = Nam
      soCmnd: new FormControl(this.selectedEntity.soCmnd || null, Validators.pattern('^[0-9]{9,12}$')),
      ngayCapCmnd: new FormControl(this.selectedEntity.ngayCapCmnd ? new Date(this.selectedEntity.ngayCapCmnd) : null),
      noiCapCmnd: new FormControl(this.selectedEntity.noiCapCmnd || null),
      diaChi: new FormControl(this.selectedEntity.diaChi || null),
      phongBanId: new FormControl(this.selectedEntity.phongBanId || null),
      chucVuId: new FormControl(this.selectedEntity.chucVuId || null),
      ngayVaoLam: new FormControl(this.selectedEntity.ngayVaoLam ? new Date(this.selectedEntity.ngayVaoLam) : null),
      trangThai: new FormControl(this.selectedEntity.trangThai || 'Đang làm việc'),
    });
  }
}
