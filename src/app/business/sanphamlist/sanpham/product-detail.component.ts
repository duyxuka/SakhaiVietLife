import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { forkJoin, Subject, takeUntil } from 'rxjs';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { StandaloneSharedModule } from '../../../standaloneshare.module';
import { ValidationMessageComponent } from 'src/app/shared/modules/validation-message/validation-message.component';
import { DonViTinhsService, NhomSanPhamsService, SanPhamsService } from '@/proxy/viet-life/business/san-phams';
import { SanPhamDto } from '@/proxy/viet-life/business/san-phams-list/san-phams';
import { NhomSanPhamInListDto } from '@/proxy/viet-life/business/san-phams-list/nhom-san-phams';
import { DonViTinhInListDto } from '@/proxy/viet-life/business/san-phams-list/don-vi-tinhs';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  standalone: true,
  imports: [
    StandaloneSharedModule,
    ValidationMessageComponent
  ]
})
export class ProductDetailComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject<void>();
  blockedPanel: boolean = false;
  btnDisabled = false;
  public form: FormGroup;
  public thumbnailImage;

  //select
  productCategories: any[] = [];
  donViTinhs: any[] = [];
  selectedEntity = {} as SanPhamDto;

  constructor(
    private productService: SanPhamsService,
    private productCategoryService: NhomSanPhamsService,
    private donViTinhsService: DonViTinhsService,
    private fb: FormBuilder,
    private config: DynamicDialogConfig,
    private ref: DynamicDialogRef,
    private utilService: UtilityService,
    private notificationSerivce: NotificationService,
    private cd: ChangeDetectorRef,
    private sanitizer: DomSanitizer
  ) { }

  validationMessages = {
    ma: [{ type: 'required', message: 'Bạn phải nhập mã duy nhất' }],
    ten: [
      { type: 'required', message: 'Bạn phải nhập tên' },
      { type: 'maxlength', message: 'Bạn không được nhập quá 255 kí tự' },
    ],
    model: [{ type: 'required', message: 'Bạn phải điền model' }],
    donViTinhId: [{ type: 'required', message: 'Bạn phải chọn đơn vị tính' }],
    nhomSanPhamId: [{ type: 'required', message: 'Bạn phải chọn danh mục' }],
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
    //Load data to form
    var productCategories = this.productCategoryService.getListAll();
    var donViTinhs = this.donViTinhsService.getListAll();
    this.toggleBlockUI(true);
    forkJoin({
      productCategories,
      donViTinhs
    })
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (response: any) => {
          this.productCategories = (response.productCategories as NhomSanPhamInListDto[]).map(pc => ({
            value: pc.id,
            label: pc.tenNhom
          }));

          this.donViTinhs = (response.donViTinhs as DonViTinhInListDto[]).map(dv => ({
            value: dv.id,
            label: dv.tenDonVi
          }));
          //Load edit data to form
          if (this.utilService.isEmpty(this.config.data?.id) == true) {
            this.getNewSuggestionCode();
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

  getNewSuggestionCode() {
    this.productService
      .getSuggestNewCode()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (response: string) => {
          this.form.patchValue({ ma: response }); // patch vào "ma"
        }
      });
  }

  loadFormDetails(id: string) {
    this.toggleBlockUI(true);
    this.productService
      .get(id)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (response: SanPhamDto) => {
          this.selectedEntity = response;
          this.loadThumbnail(this.selectedEntity.anh);
          this.form.patchValue({
            ma: this.selectedEntity.ma,
            ten: this.selectedEntity.ten,
            model: this.selectedEntity.model,
            moTa: this.selectedEntity.moTa,
            donViTinhId: this.selectedEntity.donViTinhId,
            nhomSanPhamId: this.selectedEntity.nhomSanPhamId,
            hoatDong: this.selectedEntity.hoatDong,
            giaBan: this.selectedEntity.giaBan,
            anhName: this.selectedEntity.anh
          });
          this.toggleBlockUI(false);
        },
        error: () => {
          this.toggleBlockUI(false);
        },
      });
  }

  saveChange() {
    this.toggleBlockUI(true);
    console.log(this.form.value)
    if (this.utilService.isEmpty(this.config.data?.id) == true) {
      this.productService
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
      this.productService
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
      ma: [this.selectedEntity.ma || null, [Validators.required, Validators.maxLength(250)]],
      ten: [this.selectedEntity.ten || null, Validators.required],
      model: [this.selectedEntity.model || null, Validators.required],
      moTa: [this.selectedEntity.moTa || null],
      donViTinhId: [this.selectedEntity.donViTinhId || null, Validators.required],
      nhomSanPhamId: [this.selectedEntity.nhomSanPhamId || null, Validators.required],
      hoatDong: [this.selectedEntity.hoatDong || false],
      giaBan: [this.selectedEntity.giaBan || null, Validators.required],
      anhName: [this.selectedEntity.anh || null],
      anhContent: [null],
    });
  }

  loadThumbnail(fileName: string) {
    this.productService
      .getThumbnailImage(fileName)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (response: string) => {
          var fileExt = this.selectedEntity.anh?.split('.').pop();
          this.thumbnailImage = this.sanitizer.bypassSecurityTrustResourceUrl(
            `data:image/${fileExt};base64, ${response}`
          );
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

  onFileChange(event) {
    const reader = new FileReader();

    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.form.patchValue({
          anhName: file.name,
          anhContent: (reader.result as string).split(',')[1] // lấy đúng phần base64
        });

        this.thumbnailImage = this.sanitizer.bypassSecurityTrustResourceUrl(
          reader.result as string
        );

        this.cd.markForCheck();
      };
    }
  }

  cancel() {
    this.ref?.close();
  }
}
