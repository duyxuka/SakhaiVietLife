import type { EntityDto } from '@abp/ng.core';

export interface CreateUpdateNhomDto {
  danhMucId?: string;
  ten?: string;
  slug?: string;
  logoUrl?: string;
  moTa?: string;
  thuTu: number;
  seoTitle?: string;
  seoKeywords?: string;
  seoDescription?: string;
}

export interface NhomDto {
  id?: string;
  danhMucId?: string;
  danhMucTen?: string;
  ten?: string;
  slug?: string;
  moTa?: string;
  logoUrl?: string;
  thuTu: number;
  seoTitle?: string;
  seoKeywords?: string;
  seoDescription?: string;
}

export interface NhomInListDto extends EntityDto<string> {
  danhMucId?: string;
  danhMucTen?: string;
  ten?: string;
  slug?: string;
  moTa?: string;
  logoUrl?: string;
  thuTu: number;
}
