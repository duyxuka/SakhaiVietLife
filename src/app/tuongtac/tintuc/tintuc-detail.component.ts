import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { StandaloneSharedModule } from '../../standaloneshare.module';
import { ValidationMessageComponent } from 'src/app/shared/modules/validation-message/validation-message.component';
import { TinTucDto, TinTucsService } from '@/proxy/viet-life/tuong-tac/tin-tucs';

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
  public thumbnailImage: any;

  //select
  selectedEntity = {} as TinTucDto;

  constructor(
    private tintucService: TinTucsService,
    private fb: FormBuilder,
    private config: DynamicDialogConfig,
    private ref: DynamicDialogRef,
    private utilService: UtilityService,
    private notificationSerivce: NotificationService,
    private cd: ChangeDetectorRef,
    private sanitizer: DomSanitizer
  ) { }

  validationMessages = {
    tieuDe: [
      { type: 'required', message: 'Bạn phải nhập tiêu đề' },
      { type: 'maxlength', message: 'Không được nhập quá 255 ký tự' },
    ],
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
    this.toggleBlockUI(true);
    //Load edit data to form
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
          this.loadThumbnail(this.selectedEntity.anh);
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
      this.tintucService
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
      this.tintucService
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
  loadThumbnail(fileName: string) {
    this.tintucService
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
      anhName: [this.selectedEntity.anh || null],
      anhContent: [null],
    });
  }
  onFileChange(event: any) {
    const reader = new FileReader();

    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);

      reader.onload = () => {
        this.form.patchValue({
          anhName: file.name,
          anhContent: (reader.result as string).split(',')[1],
        });

        this.thumbnailImage =
          this.sanitizer.bypassSecurityTrustResourceUrl(
            reader.result as string
          );

        this.cd.markForCheck();
      };
    }
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
