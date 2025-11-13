import type { EntityDto } from '@abp/ng.core';
import type { BaseListFilterDto } from '../../../models';

export interface CreateUpdateSanPhamDto {
  ma?: string;
  ten?: string;
  model?: string;
  moTa?: string;
  anh?: string;
  giaBan: number;
  hoatDong: boolean;
  nhomSanPhamId?: string;
  donViTinhId?: string;
  anhName?: string;
  anhContent?: string;
}

export interface SanPhamDto {
  ma?: string;
  ten?: string;
  model?: string;
  moTa?: string;
  anh?: string;
  giaBan: number;
  hoatDong: boolean;
  nhomSanPhamId?: string;
  donViTinhId?: string;
  id?: string;
}

export interface SanPhamInListDto extends EntityDto<string> {
  ma?: string;
  ten?: string;
  model?: string;
  moTa?: string;
  anh?: string;
  giaBan: number;
  hoatDong: boolean;
  nhomSanPhamId?: string;
  donViTinhId?: string;
}

export interface SanPhamListFilterDto extends BaseListFilterDto {
  nhomSanPhamId?: string;
}
