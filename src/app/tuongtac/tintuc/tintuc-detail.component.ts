import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { StandaloneSharedModule } from '../../standaloneshare.module';
import { ValidationMessageComponent } from 'src/app/shared/modules/validation-message/validation-message.component';
import { TinTucDto, TinTucsService } from '@/proxy/viet-life/tuong-tac/tin-tucs';
import { MediaHttpService } from 'src/media-http.service';

@Component({
  selector: 'app-tintuc-detail',
  templateUrl: './tintuc-detail.component.html',
  standalone: true,
  imports: [
    StandaloneSharedModule,
    ValidationMessageComponent
  ]
})
export class TinTucDetailComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject<void>();
  blockedPanel: boolean = false;
  btnDisabled = false;
  public form: FormGroup;

  previewImage: string | null = null;
  selectedFile: File | null = null;

  selectedEntity = {} as TinTucDto;

  constructor(
    private mediaHttp: MediaHttpService,
    private tintucService: TinTucsService,
    private fb: FormBuilder,
    private config: DynamicDialogConfig,
    private ref: DynamicDialogRef,
    private utilService: UtilityService,
    private notificationSerivce: NotificationService,
  ) { }

  validationMessages = {
    tieuDe: [
      { type: 'required', message: 'Bạn phải nhập tiêu đề' },
      { type: 'maxlength', message: 'Không được nhập quá 255 ký tự' },
    ],
  };

  ngOnDestroy(): void {
    this.cleanupPreview();
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
    if (this.utilService.isEmpty(this.config.data?.id) == true) {
      this.toggleBlockUI(false);
    } else {
      this.loadFormDetails(this.config.data?.id);
    }
  }

  loadFormDetails(id: string) {
    this.toggleBlockUI(true);
    this.tintucService
      .get(id)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (response: TinTucDto) => {
          this.selectedEntity = response;
          this.buildForm();
          this.loadImage(response.anh);
          this.toggleBlockUI(false);
        },
        error: () => {
          this.toggleBlockUI(false);
        },
      });
  }

  // ================== IMAGE ==================

  onSelectImage(event: any) {
    const file: File = event.files?.[0] ?? event.target?.files?.[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const MAX_SIZE = 300 * 1024;

    if (file.size > MAX_SIZE) {
      this.notificationSerivce.showError('Ảnh phải nhỏ hơn hoặc bằng 300KB');
      return;
    }

    if (!allowedTypes.includes(file.type)) {
      this.notificationSerivce.showError('Chỉ cho phép ảnh JPG, PNG, WEBP');
      return;
    }

    this.selectedFile = file;

    this.cleanupPreview();
    this.previewImage = URL.createObjectURL(file);
  }

  loadImage(fileName: string) {
    if (!fileName) return;

    this.mediaHttp.get(fileName)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(blob => {
        this.cleanupPreview();
        this.previewImage = URL.createObjectURL(blob);
      });
  }

  private cleanupPreview() {
    if (this.previewImage) {
      URL.revokeObjectURL(this.previewImage);
      this.previewImage = null;
    }
  }

  // ================== SAVE ==================

  saveChange() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.toggleBlockUI(true);

    if (this.selectedFile) {
      this.mediaHttp.upload(this.selectedFile)
        .toPromise()
        .then((res: any) => {
          this.form.patchValue({ anh: res.result });
          this.saveTinTuc();
        })
        .catch(() => {
          this.notificationSerivce.showError('Upload ảnh thất bại');
          this.toggleBlockUI(false);
        });
    } else {
      this.saveTinTuc();
    }
  }

  private saveTinTuc() {
    const request = this.utilService.isEmpty(this.config.data?.id)
      ? this.tintucService.create(this.form.value)
      : this.tintucService.update(this.config.data?.id, this.form.value);

    request
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: () => {
          this.toggleBlockUI(false);
          this.ref.close(this.form.value);
        },
        error: err => {
          this.notificationSerivce.showError(err.error?.error?.message || 'Có lỗi xảy ra');
          this.toggleBlockUI(false);
        },
      });
  }

  private buildForm() {
    this.form = this.fb.group({
      tieuDe: new FormControl(this.selectedEntity.tieuDe || null, [
        Validators.required,
        Validators.maxLength(255),
      ]),
      noiDung: new FormControl(this.selectedEntity.noiDung || null),
      ngayDang: new FormControl(
        this.selectedEntity.ngayDang
          ? new Date(this.selectedEntity.ngayDang)
          : new Date(),
        Validators.required
      ),
      trangThai: new FormControl(
        this.selectedEntity.trangThai ?? true
      ),
      anh: new FormControl(this.selectedEntity.anh || null),
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