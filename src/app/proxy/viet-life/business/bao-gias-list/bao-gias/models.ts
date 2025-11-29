import type { ChiTietBaoGiaDto, CreateUpdateChiTietBaoGiaDto } from '../chi-tiet-bao-gias/models';
import type { EntityDto } from '@abp/ng.core';

export interface BaoGiaDto {
  id?: string;
  maBaoGia?: string;
  tieuDe?: string;
  khachHangId?: string;
  nhanVienId?: string;
  ngayBaoGia?: string;
  ngayHetHan?: string;
  tongTien: number;
  chietKhau: number;
  vat: number;
  tienTeId?: string;
  daChuyenDonHang: boolean;
  chiTietBaoGias: ChiTietBaoGiaDto[];
}

export interface BaoGiaInListDto extends EntityDto<string> {
  maBaoGia?: string;
  tieuDe?: string;
  khachHangId?: string;
  nhanVienId?: string;
  ngayBaoGia?: string;
  ngayHetHan?: string;
  tongTien: number;
  chietKhau: number;
  vat: number;
  tienTeId?: string;
  daChuyenDonHang: boolean;
  tenKhachHang?: string;
  tenNhanVien?: string;
}

export interface CreateUpdateBaoGiaDto {
  maBaoGia?: string;
  tieuDe?: string;
  khachHangId?: string;
  nhanVienId?: string;
  ngayBaoGia?: string;
  ngayHetHan?: string;
  tongTien: number;
  chietKhau: number;
  vat: number;
  tienTeId?: string;
  daChuyenDonHang: boolean;
  chiTietBaoGias: CreateUpdateChiTietBaoGiaDto[];
}
