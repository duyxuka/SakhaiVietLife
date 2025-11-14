import type { EntityDto } from '@abp/ng.core';

export interface CreateUpdateHopDongNhanVienDto {
  nhanVienId?: string;
  maHopDong?: string;
  loaiHopDongId?: string;
  ngayKy?: string;
  ngayHieuLuc?: string;
  ngayHetHan?: string;
  soThang?: number;
  luongCoBan: number;
  donGiaCong: number;
  trangThai?: string;
  nguoiDuyetId?: string;
  ngayDuyet?: string;
  ghiChu?: string;
  laHienHanh: boolean;
}

export interface HopDongNhanVienDto {
  id?: string;
  nhanVienId?: string;
  tenNhanVien?: string;
  maHopDong?: string;
  loaiHopDongId?: string;
  tenLoaiHopDong?: string;
  ngayKy?: string;
  ngayHieuLuc?: string;
  ngayHetHan?: string;
  soThang?: number;
  luongCoBan: number;
  donGiaCong: number;
  trangThai?: string;
  nguoiDuyetId?: string;
  tenNguoiDuyet?: string;
  ngayDuyet?: string;
  ghiChu?: string;
  laHienHanh: boolean;
}

export interface HopDongNhanVienInListDto extends EntityDto<string> {
  maHopDong?: string;
  tenNhanVien?: string;
  tenLoaiHopDong?: string;
  ngayKy?: string;
  ngayHieuLuc?: string;
  ngayHetHan?: string;
  luongCoBan: number;
  trangThai?: string;
  laHienHanh: boolean;
}
