import type { ChiTietDonHangDto } from '../chi-tiet-don-hangs/models';
import type { EntityDto } from '@abp/ng.core';

export interface CreateUpdateDonHangDto {
  maDonHang?: string;
  baoGiaId?: string;
  khachHangId?: string;
  loaiDonHangId?: string;
  maDonHangGoc?: string;
  ngayDatHang?: string;
  tongTien: number;
  nhanVienBanHangId?: string;
  nhanVienGiaoHangId?: string;
  chiTietDonHangs: ChiTietDonHangDto[];
}

export interface DonHangDto {
  id?: string;
  maDonHang?: string;
  baoGiaId?: string;
  khachHangId?: string;
  loaiDonHangId?: string;
  maDonHangGoc?: string;
  ngayDatHang?: string;
  tongTien: number;
  nhanVienBanHangId?: string;
  nhanVienGiaoHangId?: string;
  chiTietDonHangs: ChiTietDonHangDto[];
}

export interface DonHangInListDto extends EntityDto<string> {
  maDonHang?: string;
  maDonHangGoc?: string;
  ngayDatHang?: string;
  tongTien: number;
  tenKhachHang?: string;
  nhanVienBanHang?: string;
}
