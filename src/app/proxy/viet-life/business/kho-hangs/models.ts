import type { EntityDto } from '@abp/ng.core';

export interface CreateUpdateKhoHangDto {
  tenKho?: string;
  diaChi?: string;
  thanhPhoId?: string;
}

export interface KhoHangDto {
  id?: string;
  tenKho?: string;
  diaChi?: string;
  thanhPhoId?: string;
  tenThanhPho?: string;
}

export interface KhoHangInListDto extends EntityDto<string> {
  tenKho?: string;
  thanhPhoId?: string;
  diaChi?: string;
  tenThanhPho?: string;
}
