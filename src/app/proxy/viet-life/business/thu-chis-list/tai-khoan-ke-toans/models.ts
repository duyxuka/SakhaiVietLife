import type { EntityDto } from '@abp/ng.core';

export interface CreateUpdateTaiKhoanKeToanDto {
  soTaiKhoan?: string;
  tenTaiKhoan?: string;
  moTa?: string;
}

export interface TaiKhoanKeToanDto {
  id?: string;
  soTaiKhoan?: string;
  tenTaiKhoan?: string;
  moTa?: string;
}

export interface TaiKhoanKeToanInListDto extends EntityDto<string> {
  soTaiKhoan?: string;
  tenTaiKhoan?: string;
  moTa?: string;
}
