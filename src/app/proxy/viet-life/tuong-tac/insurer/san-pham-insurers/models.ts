import type { EntityDto } from '@abp/ng.core';

export interface CreateUpdateSanPhamInsurerDto {
  nhomId?: string;
  ten?: string;
  slug?: string;
  quyenLoi?: string;
  bieuPhi?: string;
  taiLieu?: string;
  khuyenMai?: string;
  dangKy?: string;
  thuTu: number;
  hienThi: boolean;
  seoTitle?: string;
  seoKeywords?: string;
  seoDescription?: string;
}

export interface SanPhamInsurerDto {
  id?: string;
  nhomId?: string;
  nhomTen?: string;
  ten?: string;
  slug?: string;
  quyenLoi?: string;
  bieuPhi?: string;
  taiLieu?: string;
  khuyenMai?: string;
  dangKy?: string;
  thuTu: number;
  hienThi: boolean;
  seoTitle?: string;
  seoKeywords?: string;
  seoDescription?: string;
}

export interface SanPhamInsurerInListDto extends EntityDto<string> {
  nhomId?: string;
  nhomTen?: string;
  slug?: string;
  ten?: string;
  quyenLoi?: string;
  bieuPhi?: string;
  taiLieu?: string;
  khuyenMai?: string;
  dangKy?: string;
  thuTu: number;
  hienThi: boolean;
}
