import type { EntityDto } from '@abp/ng.core';

export interface CreateUpdateDonViTinhDto {
  tenDonVi?: string;
  macDinh: boolean;
}

export interface DonViTinhDto {
  id?: string;
  tenDonVi?: string;
  macDinh: boolean;
}

export interface DonViTinhInListDto extends EntityDto<string> {
  tenDonVi?: string;
  macDinh: boolean;
}
