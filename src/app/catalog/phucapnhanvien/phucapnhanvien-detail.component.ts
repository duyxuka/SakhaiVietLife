import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { PhuCapNhanVienDto, PhuCapNhanViensService } from '@proxy/viet-life/catalog/phu-cap-nhan-viens';
import { ChucVusService, ChucVuInListDto } from '@proxy/viet-life/catalog/chuc-vus';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { forkJoin, Subject, takeUntil } from 'rxjs';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { StandaloneSharedModule } from '../standaloneshare.module';
import { ValidationMessageComponent } from 'src/app/shared/modules/validation-message/validation-message.component';

@Component({
  selector: 'app-phucapnhanvien-detail',
  styleUrls: ['./phucapnhanvien.component.scss'],
  templateUrl: './phucapnhanvien-detail.component.html',
  standalone: true,
      imports: [
        StandaloneSharedModule,
        ValidationMessageComponent
      ]
})
export class PhuCapNhanVienDetailComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject<void>();
  blockedPanel = false;
  btnDisabled = false;
  form!: FormGroup;

  selectedEntity = {} as PhuCapNhanVienDto;
  chucVuList: any[] = [];

  constructor(
    private phuCapNhanVienService: PhuCapNhanViensService,
    private chucVuService: ChucVusService,
    private fb: FormBuilder,
    private config: DynamicDialogConfig,
    private ref: DynamicDialogRef,
    private utilService: UtilityService,
    private notificationService: NotificationService
  ) {}

  validationMessages = {
    tenPhuCap: [
      { type: 'required', message: 'Bạn phải nhập tên phụ cấp' },
      { type: 'maxlength', message: 'Không được vượt quá 255 ký tự' },
    ],
    soTien: [{ type: 'required', message: 'Bạn phải nhập số tiền' }],
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
      tenPhuCap: new FormControl(this.selectedEntity.tenPhuCap || null, Validators.required),
      soTien: new FormControl(this.selectedEntity.soTien || null, Validators.required),
      chucVuId: new FormControl(this.selectedEntity.chucVuId || null),
    });
  }

  private initFormData() {
    this.toggleBlockUI(true);

    forkJoin({
      chucVus: this.chucVuService.getListAll(),
    })
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (res) => {
          this.chucVuList = res.chucVus.map((x: ChucVuInListDto) => ({
            label: x.tenChucVu,
            value: x.id,
          }));

          if (this.config.data?.id) {
            this.loadFormDetails(this.config.data.id);
          } else {
            this.toggleBlockUI(false);
          }
        },
        error: () => this.toggleBlockUI(false),
      });
  }

  private loadFormDetails(id: string) {
    this.phuCapNhanVienService
      .get(id)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (response: PhuCapNhanVienDto) => {
          this.selectedEntity = response;
          this.buildForm();
          this.toggleBlockUI(false);
        },
        error: () => this.toggleBlockUI(false),
      });
  }

  saveChange() {
    if (this.form.invalid) return;

    this.toggleBlockUI(true);
    const dto = this.form.value as PhuCapNhanVienDto;

    const request = this.config.data?.id
      ? this.phuCapNhanVienService.update(this.config.data.id, dto)
      : this.phuCapNhanVienService.create(dto);

    request.pipe(takeUntil(this.ngUnsubscribe)).subscribe({
      next: () => {
        this.toggleBlockUI(false);
        this.ref.close(dto);
      },
      error: (err) => {
        this.notificationService.showError(err.error?.error?.message || 'Lỗi khi lưu dữ liệu');
        this.toggleBlockUI(false);
      },
    });
  }

  private toggleBlockUI(enabled: boolean) {
    this.blockedPanel = enabled;
    this.btnDisabled = enabled;
    if (!enabled) setTimeout(() => (this.blockedPanel = false), 300);
  }
}
