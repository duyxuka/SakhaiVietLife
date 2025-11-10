import type { EntityDto } from '@abp/ng.core';

export interface CreateUpdateLoaiCheDoDto {
  tenLoaiCheDo?: string;
  heSoCong: number;
  moTa?: string;
}

export interface LoaiCheDoDto {
  tenLoaiCheDo?: string;
  heSoCong: number;
  moTa?: string;
  id?: string;
}

export interface LoaiCheDoInListDto extends EntityDto<string> {
  tenLoaiCheDo?: string;
  heSoCong: number;
  moTa?: string;
}
