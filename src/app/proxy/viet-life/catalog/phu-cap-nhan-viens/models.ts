import type { BaseListFilterDto } from '../../models';
import type { EntityDto } from '@abp/ng.core';

export interface CreateUpdatePhuCapNhanVienDto {
  chucVuId?: string;
  tenPhuCap?: string;
  soTien: number;
}

export interface PhuCapNhanVienDto {
  chucVuId?: string;
  tenPhuCap?: string;
  soTien: number;
  id?: string;
}

export interface PhuCapNhanVienFilterListDto extends BaseListFilterDto {
  chucVuId?: string;
}

export interface PhuCapNhanVienInListDto extends EntityDto<string> {
  chucVuId?: string;
  tenPhuCap?: string;
  soTien: number;
  chucVuTen?: string;
}
