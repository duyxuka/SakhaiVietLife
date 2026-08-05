import { Plugin, ButtonView, Command } from 'ckeditor5';

export interface PdfUploadResult {
  url: string;
  fileName: string;      // tên gốc để hiển thị label
  blobFileName: string;  // tên file thực tế trên server (dùng để xóa sau này)
}

export type PdfUploadHandler = (file: File) => Promise<PdfUploadResult>;

class InsertPdfLinkCommand extends Command {
  override execute({ url, fileName }: PdfUploadResult) {
    const editor = this.editor;
    editor.model.change(writer => {
      const insertPosition = editor.model.document.selection.getFirstPosition();
      const linkText = writer.createText(`📄 ${fileName}`, { linkHref: url });
      if (insertPosition) {
        editor.model.insertContent(linkText, insertPosition);
      } else {
        editor.model.insertContent(linkText);
      }
    });
  }

  override refresh() {
    this.isEnabled = true;
  }
}

const PDF_ICON = `<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
  <path d="M4 2a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h9.5a1 1 0 0 0 .7-.29l3.5-3.5a1 1 0 0 0 .3-.71V3a1 1 0 0 0-1-1H4zm0 1h12v10.5L12.5 17H4V3z"/>
  <path d="M6 8h8v1H6zM6 11h5v1H6z"/>
</svg>`;

export class PdfUploadPlugin extends Plugin {
  static get pluginName() {
    return 'PdfUpload' as const;
  }

  init() {
    const editor = this.editor;

    editor.commands.add('insertPdfLink', new InsertPdfLinkCommand(editor));

    editor.ui.componentFactory.add('uploadPdf', locale => {
      const view = new ButtonView(locale);

      view.set({
        label: 'Chèn file PDF',
        icon: PDF_ICON,
        tooltip: true,
      });

      view.on('execute', () => {
        const handler = editor.config.get('pdfUpload.uploadHandler') as PdfUploadHandler | undefined;

        if (!handler) {
          console.warn('PdfUpload: chưa cấu hình pdfUpload.uploadHandler trong editor config');
          return;
        }

        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'application/pdf';

        input.onchange = () => {
          const file = input.files?.[0];
          if (!file) return;

          if (file.type !== 'application/pdf') {
            alert('Chỉ cho phép file PDF');
            return;
          }

          const MAX_SIZE = 10 * 1024 * 1024;
          if (file.size > MAX_SIZE) {
            alert('File PDF phải nhỏ hơn hoặc bằng 10MB');
            return;
          }

          view.set({ isEnabled: false });

          handler(file)
            .then(result => {
              editor.execute('insertPdfLink', result);

              // ✅ Bắn sự kiện để component cha (nơi nhúng <ckeditor>) biết
              // và track lại tên file thực tế trên server để dọn rác sau này
              editor.fire('pdfUploaded' as any, {
                blobFileName: result.blobFileName,
                url: result.url,
              });
            })
            .catch(() => {
              alert('Upload PDF thất bại');
            })
            .finally(() => {
              view.set({ isEnabled: true });
            });
        };

        input.click();
      });

      return view;
    });
  }
}