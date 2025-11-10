import type { EntityDto } from '@abp/ng.core';
import type { BaseListFilterDto } from '../../../models';

export interface CheDoNhanVienDto {
  nhanVienId?: string;
  loaiCheDoId?: string;
  trangThai: boolean;
  nguoiDuyetId?: string;
  phongBanId?: string;
  chiNhanhId?: string;
  soNgay?: number;
  soCong?: number;
  thanhTien?: number;
  lyDo?: string;
  ngayBatDau?: string;
  ngayKetThuc?: string;
  ghiChu?: string;
  id?: string;
}

export interface CheDoNhanVienInListDto extends EntityDto<string> {
  nhanVienId?: string;
  loaiCheDoId?: string;
  trangThai: boolean;
  nguoiDuyetId?: string;
  phongBanId?: string;
  chiNhanhId?: string;
  soNgay?: number;
  soCong?: number;
  thanhTien?: number;
  lyDo?: string;
  ngayBatDau?: string;
  ngayKetThuc?: string;
  ghiChu?: string;
  tenNhanVien?: string;
  tenLoaiCheDo?: string;
}

export interface CheDoNhanVienListFilterDto extends BaseListFilterDto {
  nhanVienId?: string;
}

export interface CreateUpdateCheDoNhanVienDto {
  nhanVienId?: string;
  loaiCheDoId?: string;
  trangThai: boolean;
  nguoiDuyetId?: string;
  phongBanId?: string;
  chiNhanhId?: string;
  soNgay?: number;
  soCong?: number;
  thanhTien?: number;
  lyDo?: string;
  ngayBatDau?: string;
  ngayKetThuc?: string;
  ghiChu?: string;
}
