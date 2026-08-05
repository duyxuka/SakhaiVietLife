import { NhomDto } from '@/proxy/viet-life/tuong-tac/insurer/nhoms';
import { DanhMucsService, NhomsService } from '@/proxy/viet-life/tuong-tac/insurers';
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
  selector: 'app-nhom-detail',
  standalone: true,
  imports: [
    StandaloneSharedModule,
    ValidationMessageComponent
  ],
  templateUrl: './nhom-detail.component.html'
})
export class NhomDetailComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject<void>();

  blockedPanel = false;
  btnDisabled = false;

  form!: FormGroup;

  selectedEntity = {} as NhomDto;
  danhMucs: any[] = [];

  previewLogo: string | null = null;
  selectedLogoFile: File | null = null;

  mediaBaseUrl = environment.apis.default.url + '/files/';

  public Editor: any;
  public configCkeditor: any;
  editorReady = false;

  // ✅ Tracker để theo dõi PDF upload trong CKEditor (field moTa)
  private pdfCleanup = new PdfCleanupTracker();
  private savedSuccessfully = false;

  constructor(
    private mediaHttp: MediaHttpService,
    private nhomService: NhomsService,
    private danhMucService: DanhMucsService,
    private fb: FormBuilder,
    private config: DynamicDialogConfig,
    private ref: DynamicDialogRef,
    private utilService: UtilityService,
    private notificationService: NotificationService,
    private ckeditorConfigService: CkeditorConfigService,
  ) { }

  validationMessages = {
    danhMucId: [
      { type: 'required', message: 'Bạn phải chọn danh mục' },
    ],
    ten: [
      { type: 'required', message: 'Bạn phải nhập tên nhóm' },
      { type: 'maxlength', message: 'Không được nhập quá 255 ký tự' },
    ],
    slug: [
      { type: 'required', message: 'Bạn phải nhập slug' },
      { type: 'maxlength', message: 'Không được nhập quá 255 ký tự' },
    ],
    thuTu: [
      { type: 'required', message: 'Bạn phải nhập thứ tự' },
    ],
  };

  ngOnInit(): void {
    this.Editor = this.ckeditorConfigService.getEditor();
    this.configCkeditor = this.ckeditorConfigService.getEditorConfig();

    this.buildForm();
    this.loadDanhMucs();
    this.initFormData();
  }

  ngOnDestroy(): void {
    this.cleanupPreviewLogo();

    // Phòng trường hợp đóng dialog bằng nút X / click ra ngoài (không qua cancel())
    if (!this.savedSuccessfully) {
      this.pdfCleanup.cleanupAllOnCancel(fileName =>
        this.mediaHttp.delete(fileName)
      ).subscribe();
    }

    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  initFormData(): void {
    this.toggleBlockUI(true);
    if (this.utilService.isEmpty(this.config.data?.id)) {
      this.toggleBlockUI(false);
      this.prepareEditor();
    } else {
      this.loadFormDetails(this.config.data?.id);
    }
  }

  loadDanhMucs(): void {
    this.danhMucService
      .getListAll()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (res: any[]) => {
          this.danhMucs = res || [];
        },
        error: () => {
          this.notificationService.showError('Không tải được danh mục');
        },
      });
  }

  loadFormDetails(id: string): void {
    this.toggleBlockUI(true);

    this.nhomService
      .get(id)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (response: NhomDto) => {
          this.selectedEntity = response;
          this.buildForm();
          this.loadLogo(response.logoUrl);
          this.toggleBlockUI(false);
          this.prepareEditor();
        },
        error: () => {
          this.toggleBlockUI(false);
        },
      });
  }

  // ================== CKEDITOR PDF TRACKING ==================

  /**
   * Gắn cho CKEditor của field moTa qua (ready) trong template.
   * Mỗi PDF upload trong phiên chỉnh sửa này sẽ được track để dọn rác sau.
   */
  onEditorReady(editor: any): void {
    editor.on('pdfUploaded', (_evt: any, data: { blobFileName: string; url: string }) => {
      this.pdfCleanup.track(data.blobFileName);
    });
  }

  private prepareEditor() {
    this.editorReady = false;
    setTimeout(() => this.editorReady = true, 100);
  }

  private buildForm(): void {
    this.form = this.fb.group({
      danhMucId: new FormControl(this.selectedEntity.danhMucId || null, [
        Validators.required,
      ]),

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
      ]),

      logoUrl: new FormControl(this.selectedEntity.logoUrl || null),
      seoTitle: new FormControl(this.selectedEntity.seoTitle || null),
      seoKeywords: new FormControl(this.selectedEntity.seoKeywords || null),
      seoDescription: new FormControl(this.selectedEntity.seoDescription || null),
    });
  }

  // ================== LOGO ==================

  onSelectLogo(event: any): void {
    const file: File = event.files?.[0];
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

    this.selectedLogoFile = file;

    this.cleanupPreviewLogo();
    this.previewLogo = URL.createObjectURL(file);
  }

  loadLogo(fileName: string): void {
    if (!fileName) return;

    this.mediaHttp.get(fileName)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(blob => {
        this.cleanupPreviewLogo();
        this.previewLogo = URL.createObjectURL(blob);
      });
  }

  private cleanupPreviewLogo(): void {
    if (this.previewLogo) {
      URL.revokeObjectURL(this.previewLogo);
      this.previewLogo = null;
    }
  }

  // ================== SAVE ==================

  saveChange(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.toggleBlockUI(true);

    if (this.selectedLogoFile) {
      this.mediaHttp.upload(this.selectedLogoFile)
        .toPromise()
        .then((res: any) => {
          this.form.patchValue({ logoUrl: res.result });
          this.saveNhom();
        })
        .catch(() => {
          this.notificationService.showError('Upload logo thất bại');
          this.toggleBlockUI(false);
        });
    } else {
      this.saveNhom();
    }
  }

  private saveNhom(): void {
    const payload = {
      ...this.form.value,
      danhMucId: String(this.form.value.danhMucId),
    };

    const request = this.utilService.isEmpty(this.config.data?.id)
      ? this.nhomService.create(payload)
      : this.nhomService.update(this.config.data?.id, payload);

    request
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: () => {
          this.savedSuccessfully = true;

          // ✅ Dọn PDF orphan sau khi lưu — kiểm tra file PDF còn được dùng
          // trong nội dung field moTa hay không
          this.pdfCleanup
            .cleanupOrphansAfterSave(this.form.value.moTa || '', this.mediaBaseUrl, fileName =>
              this.mediaHttp.delete(fileName)
            )
            .subscribe({
              error: () => {
                console.warn('Dọn PDF orphan thất bại, cần kiểm tra thủ công');
              }
            });

          this.toggleBlockUI(false);
          this.ref.close(payload);
        },
        error: err => {
          this.notificationService.showError(
            err?.error?.error?.message || 'Có lỗi xảy ra'
          );
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

  private toggleBlockUI(enabled: boolean): void {
    if (enabled) {
      this.blockedPanel = true;
      this.btnDisabled = true;
    } else {
      setTimeout(() => {
        this.blockedPanel = false;
        this.btnDisabled = false;
      }, 500);
    }
  }

  cancel(): void {
    if (!this.savedSuccessfully) {
      this.pdfCleanup.cleanupAllOnCancel(fileName =>
        this.mediaHttp.delete(fileName)
      ).subscribe();
    }
    this.ref?.close();
  }
}