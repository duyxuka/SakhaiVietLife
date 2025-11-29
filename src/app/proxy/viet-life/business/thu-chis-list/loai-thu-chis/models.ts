import type { EntityDto } from '@abp/ng.core';

export interface CreateUpdateLoaiThuChiDto {
  ten?: string;
  isThu: boolean;
  moTa?: string;
}

export interface LoaiThuChiDto {
  id?: string;
  ten?: string;
  isThu: boolean;
  moTa?: string;
}

export interface LoaiThuChiInListDto extends EntityDto<string> {
  ten?: string;
  isThu: boolean;
  moTa?: string;
}
