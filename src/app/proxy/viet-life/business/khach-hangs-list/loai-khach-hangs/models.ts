import type { EntityDto } from '@abp/ng.core';

export interface CreateUpdateLoaiKhachHangDto {
  ten?: string;
  moTa?: string;
  hieuLuc: boolean;
}

export interface LoaiKhachHangDto {
  id?: string;
  ten?: string;
  moTa?: string;
  hieuLuc: boolean;
}

export interface LoaiKhachHangInListDto extends EntityDto<string> {
  ten?: string;
  moTa?: string;
  hieuLuc: boolean;
}
