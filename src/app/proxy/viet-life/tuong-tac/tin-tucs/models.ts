import type { EntityDto } from '@abp/ng.core';

export interface CreateUpdateTinTucDto {
  tieuDe?: string;
  noiDung?: string;
  ngayDang?: string;
  anh?: string;
  trangThai: boolean;
  anhName?: string;
  anhContent?: string;
}

export interface TinTucDto {
  tieuDe?: string;
  noiDung?: string;
  ngayDang?: string;
  anh?: string;
  trangThai: boolean;
  id?: string;
}

export interface TinTucInListDto extends EntityDto<string> {
  tieuDe?: string;
  noiDung?: string;
  ngayDang?: string;
  anh?: string;
  trangThai: boolean;
}
