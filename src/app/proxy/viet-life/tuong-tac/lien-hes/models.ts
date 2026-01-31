import type { EntityDto } from '@abp/ng.core';

export interface CreateUpdateLienHeDto {
  hoVaTen?: string;
  soDienThoai?: string;
  email?: string;
  tuVan?: string;
  trangThai: boolean;
}

export interface LienHeDto {
  hoVaTen?: string;
  soDienThoai?: string;
  email?: string;
  tuVan?: string;
  trangThai: boolean;
  id?: string;
}

export interface LienHeInListDto extends EntityDto<string> {
  hoVaTen?: string;
  soDienThoai?: string;
  email?: string;
  tuVan?: string;
  trangThai: boolean;
}
