import type { EntityDto } from '@abp/ng.core';

export interface CreateUpdateThanhPhoDto {
  ten?: string;
  maVung?: string;
}

export interface ThanhPhoDto {
  id?: string;
  ten?: string;
  maVung?: string;
}

export interface ThanhPhoInListDto extends EntityDto<string> {
  ten?: string;
  maVung?: string;
  khoHangCount: number;
  khachHangCount: number;
}
