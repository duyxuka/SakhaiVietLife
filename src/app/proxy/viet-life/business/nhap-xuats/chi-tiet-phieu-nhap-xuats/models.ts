import type { EntityDto } from '@abp/ng.core';

export interface ChiTietPhieuNhapXuatDto {
  id?: string;
  phieuNhapXuatId?: string;
  maPhieu?: string;
  sanPhamId?: string;
  tenSanPham?: string;
  soLuong: number;
  donGia: number;
  chietKhau: number;
  vat: number;
  giaVon: number;
  thanhTien: number;
}

export interface CreateUpdateChiTietPhieuNhapXuatDto {
  id?: string;
  phieuNhapXuatId?: string;
  sanPhamId?: string;
  soLuong: number;
  donGia: number;
  chietKhau: number;
  vat: number;
  giaVon: number;
}

export interface ChiTietPhieuNhapXuatInListDto extends EntityDto<string> {
  tenSanPham?: string;
  soLuong: number;
  donGia: number;
  chietKhau: number;
  vat: number;
  giaVon: number;
  thanhTien: number;
}
