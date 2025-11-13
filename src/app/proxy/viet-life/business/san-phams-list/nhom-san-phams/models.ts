import type { EntityDto } from '@abp/ng.core';

export interface CreateUpdateNhomSanPhamDto {
  tenNhom?: string;
  maNhom?: string;
  hieuLuc: boolean;
}

export interface NhomSanPhamDto {
  id?: string;
  tenNhom?: string;
  maNhom?: string;
  hieuLuc: boolean;
}

export interface NhomSanPhamInListDto extends EntityDto<string> {
  tenNhom?: string;
  maNhom?: string;
  hieuLuc: boolean;
}
