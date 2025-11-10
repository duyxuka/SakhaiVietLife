import type { EntityDto } from '@abp/ng.core';

export interface CreateUpdatePhongBanDto {
  tenPhongBan?: string;
  moTa?: string;
  truongPhongId?: string;
}

export interface PhongBanDto {
  tenPhongBan?: string;
  moTa?: string;
  truongPhongId?: string;
  id?: string;
}

export interface PhongBanInListDto extends EntityDto<string> {
  tenPhongBan?: string;
  moTa?: string;
  truongPhongId?: string;
  truongPhongTen?: string;
}
