import type { EntityDto } from '@abp/ng.core';

export interface CreateUpdateTienTeDto {
  tenTienTe?: string;
  maTienTe?: string;
  tyGia: number;
  macDinh: boolean;
}

export interface TienTeDto {
  id?: string;
  tenTienTe?: string;
  maTienTe?: string;
  tyGia: number;
  macDinh: boolean;
}

export interface TienTeInListDto extends EntityDto<string> {
  tenTienTe?: string;
  maTienTe?: string;
  tyGia: number;
  macDinh: boolean;
}
