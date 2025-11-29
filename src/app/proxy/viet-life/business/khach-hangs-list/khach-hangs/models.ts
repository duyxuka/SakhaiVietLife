import type { EntityDto } from '@abp/ng.core';

export interface CreateUpdateKhachHangDto {
  maKhachHang?: string;
  tenCongTy?: string;
  tenKhachHang?: string;
  tenGiaoDich?: string;
  dienThoai?: string;
  email?: string;
  diaChi?: string;
  loaiKhachHangId?: string;
  thanhPhoId?: string;
  trangThai: boolean;
}

export interface KhachHangDto {
  id?: string;
  maKhachHang?: string;
  tenCongTy?: string;
  tenKhachHang?: string;
  tenGiaoDich?: string;
  dienThoai?: string;
  email?: string;
  diaChi?: string;
  loaiKhachHangId?: string;
  loaiKhachHangTen?: string;
  thanhPhoId?: string;
  thanhPhoTen?: string;
  trangThai: boolean;
}

export interface KhachHangInListDto extends EntityDto<string> {
  maKhachHang?: string;
  tenCongTy?: string;
  tenKhachHang?: string;
  tenGiaoDich?: string;
  dienThoai?: string;
  email?: string;
  loaiKhachHangId?: string;
  thanhPhoId?: string;
  loaiKhachHangTen?: string;
  thanhPhoTen?: string;
  diaChi?: string;
  trangThai: boolean;
}
