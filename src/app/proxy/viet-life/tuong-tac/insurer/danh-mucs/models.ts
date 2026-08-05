import type { EntityDto } from '@abp/ng.core';

export interface CreateUpdateDanhMucDto {
  ten?: string;
  slug?: string;
  moTa?: string;
  anhMenu?: string;
  thuTu: number;
}

export interface DanhMucDto {
  id?: string;
  ten?: string;
  slug?: string;
  moTa?: string;
  anhMenu?: string;
  thuTu: number;
}

export interface DanhMucInListDto extends EntityDto<string> {
  ten?: string;
  slug?: string;
  moTa?: string;
  anhMenu?: string;
  thuTu: number;
}

export interface DanhMucMenuDto {
  ten?: string;
  slug?: string;
  moTa?: string;
  anhMenu?: string;
  nhoms: NhomMenuDto[];
}

export interface NhomMenuDto {
  ten?: string;
  slug?: string;
  sanPhams: SanPhamMenuDto[];
}

export interface SanPhamMenuDto {
  ten?: string;
  slug?: string;
}
