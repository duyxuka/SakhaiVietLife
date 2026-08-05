import { BaiVietDto } from '@/proxy/viet-life/tuong-tac/insurer/bai-viets';
import { NhomDto } from '@/proxy/viet-life/tuong-tac/insurer/nhoms';
import { BaiVietsService, NhomsService } from '@/proxy/viet-life/tuong-tac/insurers';
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
  selector: 'app-baiviet-detail.component',
  standalone: true,
  imports: [StandaloneSharedModule, ValidationMessageComponent],
  templateUrl: './baiviet-detail.component.html'
})
export class BaivietDetailComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject<void>();
  blockedPanel = false;
  btnDisabled = false;
  form: FormGroup;
  selectedEntity = {} as BaiVietDto;
  nhomOptions: { label: string; value: string }[] = [];

  previewImage: string | null = null;
  selectedFile: File | null = null;

  mediaBaseUrl = environment.apis.default.url + '/files/';

  public Editor: any;
  public configCkeditor: any;
  editorReady = false;

  // ✅ Một tracker DÙNG CHUNG cho cả 2 editor (moTaNgan + noiDung),
  // vì cả 2 cùng thuộc 1 phiên chỉnh sửa bài viết này
  private pdfCleanup = new PdfCleanupTracker();
  private savedSuccessfully = false;

  validationMessages = {
    tieuDe: [
      { type: 'required', message: 'Bạn phải nhập tiêu đề' },
      { type: 'maxlength', message: 'Không được nhập quá 255 ký tự' },
    ],
    slug: [
      { type: 'required', message: 'Bạn phải nhập slug' },
      { type: 'maxlength', message: 'Không được nhập quá 255 ký tự' },
    ],
    nhomId: [
      { type: 'required', message: 'Bạn phải chọn nhóm' },
    ],
  };

  constructor(
    private mediaHttp: MediaHttpService,
    private baiVietService: BaiVietsService,
    private nhomService: NhomsService,
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
    this.loadNhomOptions();
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

  loadNhomOptions() {
    this.nhomService.getListAll()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (res: NhomDto[]) => {
          this.nhomOptions = res.map(x => ({ label: x.ten, value: x.id }));
        }
      });
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
    this.baiVietService.get(id)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (res: BaiVietDto) => {
          this.selectedEntity = res;
          if (res.anhDaiDien) {
            this.previewImage = this.mediaBaseUrl + res.anhDaiDien;
          }
          this.buildForm();
          this.toggleBlockUI(false);
          this.prepareEditor();
        },
        error: () => this.toggleBlockUI(false),
      });
  }

  // ================== CKEDITOR PDF TRACKING ==================

  /**
   * Gắn chung cho CẢ 2 editor (moTaNgan và noiDung) qua (ready) trong template.
   * Vì dùng chung 1 pdfCleanup, không cần phân biệt editor nào bắn sự kiện —
   * miễn PDF được upload trong phiên này, đều được track để dọn rác sau.
   */
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
    const MAX_SIZE = 2 * 1024 * 1024; // 2MB

    if (file.size > MAX_SIZE) {
      this.notificationService.showError('Ảnh phải nhỏ hơn hoặc bằng 2MB');
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

  private cleanupPreview() {
    if (this.previewImage && this.previewImage.startsWith('blob:')) {
      URL.revokeObjectURL(this.previewImage);
    }
    this.previewImage = null;
  }

  // ================== SAVE ==================
  saveChange() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.toggleBlockUI(true);

    if (this.selectedFile) {
      this.mediaHttp.upload(this.selectedFile).subscribe({
        next: (res: any) => {
          this.form.patchValue({ anhDaiDien: res.result });
          this.saveBaiViet();
        },
        error: () => {
          this.notificationService.showError('Upload ảnh thất bại');
          this.toggleBlockUI(false);
        }
      });
    } else {
      this.saveBaiViet();
    }
  }

  private saveBaiViet() {
    const isNew = this.utilService.isEmpty(this.config.data?.id);
    const request = isNew
      ? this.baiVietService.create(this.form.value)
      : this.baiVietService.update(this.config.data?.id, this.form.value);

    request.pipe(takeUntil(this.ngUnsubscribe)).subscribe({
      next: () => {
        this.savedSuccessfully = true;

        // ✅ Dọn PDF orphan sau khi lưu — kiểm tra file PDF còn được dùng ở
        // CẢ HAI field (moTaNgan + noiDung), gộp nội dung lại rồi mới tính orphan
        const combinedHtml = `${this.form.value.moTaNgan || ''} ${this.form.value.noiDung || ''}`;

        this.pdfCleanup
          .cleanupOrphansAfterSave(combinedHtml, this.mediaBaseUrl, fileName =>
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

  private prepareEditor() {
    this.editorReady = false;
    setTimeout(() => this.editorReady = true, 100);
  }

  onTieuDeBlur() {
    const tieuDe = this.form.get('tieuDe')?.value ?? '';
    if (!this.form.get('slug')?.value) {
      this.form.patchValue({ slug: this.utilService.MakeSeoTitle(tieuDe) });
    }
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
      nhomId: new FormControl(this.selectedEntity.nhomId || null, Validators.required),
      sanPhamId: new FormControl(this.selectedEntity.sanPhamId || null),
      tieuDe: new FormControl(this.selectedEntity.tieuDe || null, [
        Validators.required,
        Validators.maxLength(255),
      ]),
      slug: new FormControl(this.selectedEntity.slug || null, [
        Validators.required,
        Validators.maxLength(255),
      ]),
      moTaNgan: new FormControl(this.selectedEntity.moTaNgan || null),
      noiDung: new FormControl(this.selectedEntity.noiDung || null),
      xuatBanLuc: new FormControl(
        this.selectedEntity.xuatBanLuc ? new Date(this.selectedEntity.xuatBanLuc) : new Date(),
        Validators.required
      ),
      hienThi: new FormControl(this.selectedEntity.hienThi ?? true),
      anhDaiDien: new FormControl(this.selectedEntity.anhDaiDien || null), // 👈 chỉ filename
      seoTitle: new FormControl(this.selectedEntity.seoTitle || null),
      seoKeywords: new FormControl(this.selectedEntity.seoKeywords || null),
      seoDescription: new FormControl(this.selectedEntity.seoDescription || null),
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