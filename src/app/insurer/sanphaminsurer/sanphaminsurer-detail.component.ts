import { NhomInListDto } from '@/proxy/viet-life/tuong-tac/insurer/nhoms';
import { SanPhamInsurerDto } from '@/proxy/viet-life/tuong-tac/insurer/san-pham-insurers';
import { NhomsService, SanPhamInsurersService } from '@/proxy/viet-life/tuong-tac/insurers';
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
  selector: 'app-sanphaminsurer-detail.component',
  standalone: true,
  imports: [
    StandaloneSharedModule,
    ValidationMessageComponent
  ],
  templateUrl: './sanphaminsurer-detail.component.html'
})
export class SanphaminsurerDetailComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject<void>();
  blockedPanel: boolean = false;
  btnDisabled = false;
  public form: FormGroup;

  selectedEntity = {} as SanPhamInsurerDto;
  nhomOptions: NhomInListDto[] = [];

  mediaBaseUrl = environment.apis.default.url + '/files/';

  public Editor: any;
  public configCkeditor: any;
  editorReady = false;

  // ✅ Một tracker DÙNG CHUNG cho cả 5 editor (quyenLoi, bieuPhi, khuyenMai,
  // taiLieu, dangKy), vì cả 5 cùng thuộc 1 phiên chỉnh sửa sản phẩm này
  private pdfCleanup = new PdfCleanupTracker();
  private savedSuccessfully = false;

  constructor(
    private mediaHttp: MediaHttpService,
    private sanPhamService: SanPhamInsurersService,
    private nhomService: NhomsService,
    private fb: FormBuilder,
    private config: DynamicDialogConfig,
    private ref: DynamicDialogRef,
    private utilService: UtilityService,
    private notificationService: NotificationService,
    private ckeditorConfigService: CkeditorConfigService,
  ) { }

  validationMessages = {
    ten: [
      { type: 'required', message: 'Bạn phải nhập tên sản phẩm' },
      { type: 'maxlength', message: 'Không được nhập quá 255 ký tự' },
    ],
    slug: [
      { type: 'required', message: 'Bạn phải nhập slug' },
      { type: 'maxlength', message: 'Không được nhập quá 255 ký tự' },
    ],
    nhomId: [
      { type: 'required', message: 'Bạn phải chọn nhóm sản phẩm' },
    ],
    thuTu: [
      { type: 'required', message: 'Bạn phải nhập thứ tự' },
    ],
  };

  ngOnDestroy(): void {
    // Phòng trường hợp đóng dialog bằng nút X / click ra ngoài (không qua cancel())
    if (!this.savedSuccessfully) {
      this.pdfCleanup.cleanupAllOnCancel(fileName =>
        this.mediaHttp.delete(fileName)
      ).subscribe();
    }

    if (this.ref) {
      this.ref.close();
    }
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  ngOnInit(): void {
    this.Editor = this.ckeditorConfigService.getEditor();
    this.configCkeditor = this.ckeditorConfigService.getEditorConfig();

    this.loadNhomOptions();
    this.buildForm();
    this.initFormData();
  }

  loadNhomOptions() {
    this.nhomService.getListAll()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (res) => {
          this.nhomOptions = res;
        }
      });
  }

  initFormData() {
    this.toggleBlockUI(true);
    if (this.utilService.isEmpty(this.config.data?.id) == true) {
      this.toggleBlockUI(false);
      this.prepareEditor();
    } else {
      this.loadFormDetails(this.config.data?.id);
    }
  }

  loadFormDetails(id: string) {
    this.toggleBlockUI(true);
    this.sanPhamService
      .get(id)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (response: SanPhamInsurerDto) => {
          this.selectedEntity = response;
          this.buildForm();
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
   * Gắn chung cho CẢ 5 editor (quyenLoi, bieuPhi, khuyenMai, taiLieu, dangKy)
   * qua (ready) trong template. Vì dùng chung 1 pdfCleanup, không cần phân
   * biệt editor nào bắn sự kiện — miễn PDF được upload trong phiên này,
   * đều được track để dọn rác sau.
   */
  onEditorReady(editor: any): void {
    editor.on('pdfUploaded', (_evt: any, data: { blobFileName: string; url: string }) => {
      this.pdfCleanup.track(data.blobFileName);
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

  saveChange() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.toggleBlockUI(true);

    const isNew = this.utilService.isEmpty(this.config.data?.id) == true;
    const request = isNew
      ? this.sanPhamService.create(this.form.value)
      : this.sanPhamService.update(this.config.data?.id, this.form.value);

    request
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: () => {
          this.savedSuccessfully = true;

          // ✅ Dọn PDF orphan sau khi lưu — kiểm tra file PDF còn được dùng ở
          // CẢ 5 field, gộp nội dung lại rồi mới tính orphan
          const combinedHtml = [
            this.form.value.quyenLoi,
            this.form.value.bieuPhi,
            this.form.value.khuyenMai,
            this.form.value.taiLieu,
            this.form.value.dangKy,
          ].filter(Boolean).join(' ');

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

  private buildForm() {
    this.form = this.fb.group({
      nhomId: new FormControl(this.selectedEntity.nhomId || null, [
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
      quyenLoi: new FormControl(this.selectedEntity.quyenLoi || null),
      bieuPhi: new FormControl(this.selectedEntity.bieuPhi || null),
      taiLieu: new FormControl(this.selectedEntity.taiLieu || null),
      khuyenMai: new FormControl(this.selectedEntity.khuyenMai || null),
      dangKy: new FormControl(this.selectedEntity.dangKy || null),
      thuTu: new FormControl(this.selectedEntity.thuTu ?? 0, [
        Validators.required,
      ]),
      hienThi: new FormControl(this.selectedEntity.hienThi ?? true),
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

  cancel() {
    if (!this.savedSuccessfully) {
      this.pdfCleanup.cleanupAllOnCancel(fileName =>
        this.mediaHttp.delete(fileName)
      ).subscribe();
    }
    this.ref?.close();
  }

}