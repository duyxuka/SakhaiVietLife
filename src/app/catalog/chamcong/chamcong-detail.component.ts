import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ChamCongDto, ChamCongsService } from '@proxy/viet-life/catalog/cham-congs';
import { UserInListDto, UsersService } from '@proxy/viet-life/system/users';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { forkJoin, Subject, takeUntil } from 'rxjs';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { StandaloneSharedModule } from '../../standaloneshare.module';
import { ValidationMessageComponent } from 'src/app/shared/modules/validation-message/validation-message.component';

@Component({
  selector: 'app-chamcong-detail',
  templateUrl: './chamcong-detail.component.html',
  standalone: true,
  imports: [
    StandaloneSharedModule,
    ValidationMessageComponent
  ]
})
export class ChamCongDetailComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject<void>();
  blockedPanel: boolean = false;
  btnDisabled = false;
  public form: FormGroup;

  //select
  selectedEntity = {} as ChamCongDto;
  userslist: any[] = [];

  constructor(
    private chamcongService: ChamCongsService,
    private fb: FormBuilder,
    private config: DynamicDialogConfig,
    private ref: DynamicDialogRef,
    private utilService: UtilityService,
    private notificationSerivce: NotificationService,
    private userService: UsersService
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
  }


  initFormData() {
    var key = '';
    var userslist = this.userService.getListAll(key);

    this.toggleBlockUI(true);
    forkJoin({
      userslist,
    })
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (response: any) => {
          //Push data to select
          var userslist = response.userslist as UserInListDto[];

          userslist.forEach(element => {
            this.userslist.push({
              value: element.id,
              label: element.name,
            });
          });
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
    this.chamcongService
      .get(id)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (response: ChamCongDto) => {
          this.selectedEntity = response;
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

    if (this.utilService.isEmpty(this.config.data?.id) == true) {
      this.chamcongService
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
      this.chamcongService
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
      nhanVienId: new FormControl(this.selectedEntity.nhanVienId || null, Validators.required),
      ngayLam: new FormControl(this.selectedEntity.ngayLam ? new Date(this.selectedEntity.ngayLam) : null, Validators.required),
      gioVao: new FormControl(this.selectedEntity.gioVao ? new Date(this.selectedEntity.gioVao) : null),
      gioRa: new FormControl(this.selectedEntity.gioRa ? new Date(this.selectedEntity.gioRa) : null),
      soGioLam: new FormControl(this.selectedEntity.soGioLam || null),
      soPhutDiMuon: new FormControl(this.selectedEntity.soPhutDiMuon || null),
      soPhutVeSom: new FormControl(this.selectedEntity.soPhutVeSom || null),
      congNgay: new FormControl(this.selectedEntity.congNgay || null),
      trangThai: new FormControl(this.selectedEntity.trangThai || false)
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
