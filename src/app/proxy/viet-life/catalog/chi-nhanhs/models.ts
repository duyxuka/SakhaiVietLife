import type { EntityDto } from '@abp/ng.core';

export interface ChiNhanhDto {
  tenChiNhanh?: string;
  moTa?: string;
  id?: string;
}

export interface ChiNhanhInListDto extends EntityDto<string> {
  tenChiNhanh?: string;
  moTa?: string;
}

export interface CreateUpdateChiNhanhDto {
  tenChiNhanh?: string;
  moTa?: string;
}
