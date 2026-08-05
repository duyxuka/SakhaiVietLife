import type { EntityDto } from '@abp/ng.core';

export interface BaiVietDto {
  id?: string;
  nhomId?: string;
  nhomTen?: string;
  sanPhamId?: string;
  sanPhamTen?: string;
  tieuDe?: string;
  slug?: string;
  moTaNgan?: string;
  noiDung?: string;
  anhDaiDien?: string;
  xuatBanLuc?: string;
  hienThi: boolean;
  seoTitle?: string;
  seoKeywords?: string;
  seoDescription?: string;
}

export interface BaiVietInListDto extends EntityDto<string> {
  nhomId?: string;
  nhomTen?: string;
  sanPhamId?: string;
  sanPhamTen?: string;
  tieuDe?: string;
  slug?: string;
  moTaNgan?: string;
  anhDaiDien?: string;
  xuatBanLuc?: string;
  hienThi: boolean;
}

export interface CreateUpdateBaiVietDto {
  nhomId?: string;
  sanPhamId?: string;
  tieuDe?: string;
  slug?: string;
  moTaNgan?: string;
  noiDung?: string;
  anhDaiDien?: string;
  xuatBanLuc?: string;
  hienThi: boolean;
  seoTitle?: string;
  seoKeywords?: string;
  seoDescription?: string;
}
