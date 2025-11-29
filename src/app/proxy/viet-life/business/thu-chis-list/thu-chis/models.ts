import type { DoiTuongType } from '../../../thu-chis/doi-tuong-type.enum';
import type { PaymentMethod } from '../../../thu-chis/payment-method.enum';
import type { ThuChiStatus } from '../../../thu-chis/thu-chi-status.enum';
import type { EntityDto } from '@abp/ng.core';

export interface CreateUpdateThuChiDto {
  maPhieu?: string;
  ngayGiaoDich?: string;
  ngayHachToan?: string;
  dienGiai?: string;
  soTien: number;
  loaiThuChiId?: string;
  taiKhoanNoId?: string;
  taiKhoanCoId?: string;
  doiTuongId?: string;
  loaiDoiTuong?: DoiTuongType;
  phuongThucThanhToan?: PaymentMethod;
  soTaiKhoanNganHang?: string;
  tenNganHang?: string;
  soHoaDon?: string;
  ngayHoaDon?: string;
  thueSuat?: number;
  tienThue?: number;
  thanhTienSauThue?: number;
}

export interface ThuChiDto {
  id?: string;
  maPhieu?: string;
  ngayGiaoDich?: string;
  ngayHachToan?: string;
  dienGiai?: string;
  soTien: number;
  loaiThuChiId?: string;
  loaiThuChiTen?: string;
  taiKhoanNoId?: string;
  taiKhoanNo?: string;
  taiKhoanCoId?: string;
  taiKhoanCo?: string;
  doiTuongId?: string;
  loaiDoiTuong?: DoiTuongType;
  phuongThucThanhToan?: PaymentMethod;
  soTaiKhoanNganHang?: string;
  tenNganHang?: string;
  soHoaDon?: string;
  ngayHoaDon?: string;
  thueSuat?: number;
  tienThue?: number;
  thanhTienSauThue?: number;
  status?: ThuChiStatus;
  nguoiDuyetId?: string;
  ngayDuyet?: string;
  lyDoHuy?: string;
}

export interface ThuChiInListDto extends EntityDto<string> {
  maPhieu?: string;
  ngayGiaoDich?: string;
  ngayHachToan?: string;
  dienGiai?: string;
  soTien: number;
  loaiThuChiId?: string;
  taiKhoanNoId?: string;
  taiKhoanCoId?: string;
  doiTuongId?: string;
  loaiDoiTuong?: DoiTuongType;
  phuongThucThanhToan?: PaymentMethod;
  soTaiKhoanNganHang?: string;
  tenNganHang?: string;
  soHoaDon?: string;
  ngayHoaDon?: string;
  thueSuat?: number;
  tienThue?: number;
  thanhTienSauThue?: number;
  status?: ThuChiStatus;
  nguoiDuyetId?: string;
  ngayDuyet?: string;
  lyDoHuy?: string;
  tenLoaiThuChi?: string;
  tenTaiKhoanNo?: string;
  tenTaiKhoanCo?: string;
  tenNguoiDuyet?: string;
}
