import type { EntityDto } from '@abp/ng.core';
import type { BaseListFilterDto } from '../../models';

export interface CreateUpdateLichLamViecDto {
  thang: number;
  nam: number;
  ngayLam?: string;
  ngayNghi?: string;
  caLamMacDinh?: string;
  gioBatDauMacDinh?: string;
  gioKetThucMacDinh?: string;
  ghiChu?: string;
}

export interface LichLamViecDto {
  thang: number;
  nam: number;
  ngayLam?: string;
  ngayNghi?: string;
  caLamMacDinh?: string;
  gioBatDauMacDinh?: string;
  gioKetThucMacDinh?: string;
  ghiChu?: string;
  id?: string;
}

export interface LichLamViecInListDto extends EntityDto<string> {
  thang: number;
  nam: number;
  ngayLam?: string;
  ngayNghi?: string;
  caLamMacDinh?: string;
  gioBatDauMacDinh?: string;
  gioKetThucMacDinh?: string;
  ghiChu?: string;
}

export interface LichLamViecListFilterDto extends BaseListFilterDto {
  startDate?: string;
  endDate?: string;
}
