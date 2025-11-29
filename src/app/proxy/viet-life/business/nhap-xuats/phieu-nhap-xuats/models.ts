import type { ChiTietPhieuNhapXuatInListDto, CreateUpdateChiTietPhieuNhapXuatDto } from '../chi-tiet-phieu-nhap-xuats/models';
import type { EntityDto } from '@abp/ng.core';

export interface CreateUpdatePhieuNhapXuatDto {
  maPhieu?: string;
  loaiNhapXuatId?: string;
  khoId?: string;
  khoDenId?: string;
  donHangId?: string;
  baoGiaId?: string;
  nhanVienLapId?: string;
  ngayLap?: string;
  chiTietPhieuNhapXuats: CreateUpdateChiTietPhieuNhapXuatDto[];
}

export interface PhieuNhapXuatDto {
  id?: string;
  maPhieu?: string;
  loaiNhapXuatId?: string;
  loaiNhapXuatTen?: string;
  khoId?: string;
  khoTen?: string;
  khoDenId?: string;
  khoDenTen?: string;
  donHangId?: string;
  maDonHang?: string;
  baoGiaId?: string;
  maBaoGia?: string;
  nhanVienLapId?: string;
  tenNhanVienLap?: string;
  ngayLap?: string;
  chiTietPhieuNhapXuats: ChiTietPhieuNhapXuatInListDto[];
}

export interface PhieuNhapXuatInListDto extends EntityDto<string> {
  maPhieu?: string;
  loaiNhapXuatTen?: string;
  khoTen?: string;
  khoDenTen?: string;
  ngayLap?: string;
  tenNhanVienLap?: string;
}
