import { DanhMucDto } from '@/proxy/viet-life/tuong-tac/insurer/danh-mucs';
import { DanhMucsService } from '@/proxy/viet-life/tuong-tac/insurers';
import { ValidationMessageComponent } from '@/shared/modules/validation-message/validation-message.component';
import { NotificationService } from '@/shared/services/notification.service';
import { UtilityService } from '@/shared/services/utility.service';
import { StandaloneSharedModule } from '@/standaloneshare.module';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { CkeditorConfigService } from 'src/ckeditor-config.service';
import { PdfCleanupTracker } from 'src/core/pdf-cleanup.tracker';
import { environment } from 'src/environments/environment';
import { MediaHttpService } from 'src/media-http.service';

@Component({
  selector: 'app-danhmuc-detail.component',
  standalone: true,
  imports: [
    StandaloneSharedModule,
    ValidationMessageComponent
  ],
  templateUrl: './danhmuc-detail.component.html'
})
export class DanhmucDetailComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject<void>();
  blockedPanel = false;
  btnDisabled = false;
  form: FormGroup;
  selectedEntity = {} as DanhMucDto;

  previewImage: string | null = null;
  selectedFile: File | null = null;

  public Editor: any;
  public configCkeditor: any;
  editorReady = false;

  // ✅ Track file PDF upload trong phiên chỉnh sửa hiện tại
  private pdfCleanup = new PdfCleanupTracker();
  private savedSuccessfully = false;
  private mediaBaseUrl = environment.apis.default.url + '/files/';

  validationMessages = {
    ten: [
      { type: 'required', message: 'Bạn phải nhập tên danh mục' },
      { type: 'maxlength', message: 'Không được nhập quá 255 ký tự' },
    ],
    slug: [
      { type: 'required', message: 'Bạn phải nhập slug' },
      { type: 'maxlength', message: 'Không được nhập quá 255 ký tự' },
    ],
    thuTu: [
      { type: 'required', message: 'Bạn phải nhập thứ tự' },
      { type: 'min', message: 'Thứ tự phải lớn hơn hoặc bằng 0' },
    ],
  };

  constructor(
    private mediaHttp: MediaHttpService,
    private danhMucService: DanhMucsService,
    private fb: FormBuilder,
    private config: DynamicDialogConfig,
    private ref: DynamicDialogRef,
    private utilService: UtilityService,
    private notificationService: NotificationService,
    private ckeditorConfigService: CkeditorConfigService,
  ) { }

  ngOnInit(): void {
    this.Editor = this.ckeditorConfigService.getEditor();
    this.configCkeditor = this.ckeditorConfigService.getEditorConfig();

    this.buildForm();
    this.initFormData();
  }

  ngOnDestroy(): void {
    this.cleanupPreview();

    // Phòng trường hợp đóng dialog bằng nút X / click ra ngoài (không qua cancel())
    if (!this.savedSuccessfully) {
      this.pdfCleanup.cleanupAllOnCancel(fileName =>
        this.mediaHttp.delete(fileName)
      ).subscribe();
    }

    if (this.ref) this.ref.close();
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  initFormData() {
    this.toggleBlockUI(true);
    if (this.utilService.isEmpty(this.config.data?.id)) {
      this.toggleBlockUI(false);
      this.prepareEditor();
    } else {
      this.loadFormDetails(this.config.data?.id);
    }
  }

  loadFormDetails(id: string) {
    this.toggleBlockUI(true);
    this.danhMucService.get(id)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (res: DanhMucDto) => {
          this.selectedEntity = res;
          this.buildForm();
          this.loadImage(res.anhMenu);
          this.toggleBlockUI(false);
          this.prepareEditor();
        },
        error: () => this.toggleBlockUI(false),
      });
  }

  // ================== CKEDITOR PDF TRACKING ==================

  onEditorReady(editor: any): void {
    editor.on('pdfUploaded', (_evt: any, data: { blobFileName: string; url: string }) => {
      this.pdfCleanup.track(data.blobFileName);
    });
  }

  // ================== IMAGE ==================

  onSelectImage(event: any) {
    const file: File = event.files?.[0] ?? event.target?.files?.[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const MAX_SIZE = 300 * 1024;

    if (file.size > MAX_SIZE) {
      this.notificationService.showError('Ảnh phải nhỏ hơn hoặc bằng 300KB');
      return;
    }

    if (!allowedTypes.includes(file.type)) {
      this.notificationService.showError('Chỉ cho phép ảnh JPG, PNG, WEBP');
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
          this.form.patchValue({ anhMenu: res.result });
          this.saveDanhMuc();
        })
        .catch(() => {
          this.notificationService.showError('Upload ảnh thất bại');
          this.toggleBlockUI(false);
        });
    } else {
      this.saveDanhMuc();
    }
  }

  private saveDanhMuc() {
    const isNew = this.utilService.isEmpty(this.config.data?.id);
    const request = isNew
      ? this.danhMucService.create(this.form.value)
      : this.danhMucService.update(this.config.data?.id, this.form.value);

    request.pipe(takeUntil(this.ngUnsubscribe)).subscribe({
      next: () => {
        this.savedSuccessfully = true;

        // ✅ Dọn PDF orphan sau khi lưu — chỉ cần kiểm tra trong moTa (1 editor duy nhất)
        this.pdfCleanup
          .cleanupOrphansAfterSave(this.form.value.moTa, this.mediaBaseUrl, fileName =>
            this.mediaHttp.delete(fileName)
          )
          .subscribe({
            error: () => {
              console.warn('Dọn PDF orphan thất bại, cần kiểm tra thủ công');
            }
          });

        this.toggleBlockUI(false);
        this.ref.close(this.form.value);
      },
      error: err => {
        this.notificationService.showError(err.error?.error?.message || 'Có lỗi xảy ra');
        this.toggleBlockUI(false);
      },
    });
  }

  onTenBlur() {
    const ten = this.form.get('ten')?.value ?? '';
    if (!this.form.get('slug')?.value) {
      this.form.patchValue({ slug: this.utilService.MakeSeoTitle(ten) });
    }
  }

  private prepareEditor() {
    this.editorReady = false;
    setTimeout(() => this.editorReady = true, 100);
  }

  cancel() {
    if (!this.savedSuccessfully) {
      this.pdfCleanup.cleanupAllOnCancel(fileName =>
        this.mediaHttp.delete(fileName)
      ).subscribe();
    }
    this.ref?.close();
  }

  private buildForm() {
    this.form = this.fb.group({
      ten: new FormControl(this.selectedEntity.ten || null, [
        Validators.required,
        Validators.maxLength(255),
      ]),
      slug: new FormControl(this.selectedEntity.slug || null, [
        Validators.required,
        Validators.maxLength(255),
      ]),
      moTa: new FormControl(this.selectedEntity.moTa || null),
      thuTu: new FormControl(this.selectedEntity.thuTu ?? 0, [
        Validators.required,
        Validators.min(0),
      ]),
      anhMenu: new FormControl(this.selectedEntity.anhMenu || null),
    });
  }

  private toggleBlockUI(enabled: boolean) {
    if (enabled) {
      this.blockedPanel = true;
      this.btnDisabled = true;
    } else {
      setTimeout(() => {
        this.blockedPanel = false;
        this.btnDisabled = false;
      }, 1000);
    }
  }
}