import type { EntityDto } from '@abp/ng.core';
import type { BaseListFilterDto } from '../../models';

export interface ChamCongDto {
  nhanVienId?: string;
  ngayLam?: string;
  gioVao?: string;
  gioRa?: string;
  soGioLam?: number;
  soPhutDiMuon?: number;
  soPhutVeSom?: number;
  congNgay?: number;
  trangThai: boolean;
  id?: string;
}

export interface ChamCongInListDto extends EntityDto<string> {
  nhanVienId?: string;
  ngayLam?: string;
  gioVao?: string;
  gioRa?: string;
  soGioLam?: number;
  soPhutDiMuon?: number;
  soPhutVeSom?: number;
  congNgay?: number;
  trangThai: boolean;
  tenNhanVien?: string;
}

export interface ChamCongListFilterDto extends BaseListFilterDto {
  nhanVienId?: string;
}

export interface CreateUpdateChamCongDto {
  nhanVienId?: string;
  ngayLam?: string;
  gioVao?: string;
  gioRa?: string;
  soGioLam?: number;
  soPhutDiMuon?: number;
  soPhutVeSom?: number;
  congNgay?: number;
  trangThai: boolean;
}
