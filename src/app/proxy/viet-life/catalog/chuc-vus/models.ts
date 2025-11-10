import type { EntityDto } from '@abp/ng.core';

export interface ChucVuDto {
  tenChucVu?: string;
  moTa?: string;
  id?: string;
}

export interface ChucVuInListDto extends EntityDto<string> {
  tenChucVu?: string;
  moTa?: string;
}

export interface CreateUpdateChucVuDto {
  tenChucVu?: string;
  moTa?: string;
}
