import { Observable, forkJoin, of } from 'rxjs';

export class PdfCleanupTracker {
  /** Danh sách blobFileName đã upload TRONG PHIÊN chỉnh sửa hiện tại (chưa chắc đã lưu) */
  private uploadedThisSession: string[] = [];

  track(blobFileName: string): void {
    this.uploadedThisSession.push(blobFileName);
  }

  /** Trích tất cả blobFileName đang thực sự xuất hiện trong nội dung HTML đã lưu */
  private extractUsedFileNames(html: string | null | undefined, mediaBaseUrl: string): Set<string> {
    if (!html) return new Set();
    const used = new Set<string>();
    const escapedBase = mediaBaseUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`${escapedBase}([^"'\\s>]+)`, 'g');
    let match: RegExpExecArray | null;
    while ((match = regex.exec(html)) !== null) {
      used.add(match[1]);
    }
    return used;
  }

  /**
   * Gọi khi LƯU form: xóa những file đã upload trong phiên này
   * nhưng cuối cùng KHÔNG còn xuất hiện trong nội dung (user đã xóa link khỏi editor trước khi lưu)
   */
  cleanupOrphansAfterSave(
    finalHtml: string | null | undefined,
    mediaBaseUrl: string,
    deleteFn: (fileName: string) => Observable<void>
  ): Observable<void[]> {
    const usedNow = this.extractUsedFileNames(finalHtml, mediaBaseUrl);
    const orphans = this.uploadedThisSession.filter(f => !usedNow.has(f));

    this.uploadedThisSession = [];

    if (orphans.length === 0) return of([]);
    return forkJoin(orphans.map(f => deleteFn(f)));
  }

  /**
   * Gọi khi HỦY form (không lưu gì cả): xóa TẤT CẢ file đã upload trong phiên này,
   * vì không có gì được lưu lại nên toàn bộ đều là rác
   */
  cleanupAllOnCancel(deleteFn: (fileName: string) => Observable<void>): Observable<void[]> {
    const toDelete = [...this.uploadedThisSession];
    this.uploadedThisSession = [];

    if (toDelete.length === 0) return of([]);
    return forkJoin(toDelete.map(f => deleteFn(f)));
  }
}