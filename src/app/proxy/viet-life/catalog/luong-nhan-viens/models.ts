import type { EntityDto } from '@abp/ng.core';
import type { BaseListFilterDto } from '../../models';

export interface CreateUpdateLuongNhanVienDto {
  nhanVienId?: string;
  thang: number;
  nam: number;
  luongTheoNgayCong?: number;
  phuCap?: number;
  thuongKpi?: number;
  thuongKhac?: number;
  khauTru?: number;
  congTruCheDo?: number;
  tongLuong?: number;
  ngayTinhLuong?: string;
  nguoiTinhLuongId?: string;
  ghiChu?: string;
}

export interface LuongNhanVienDto {
  nhanVienId?: string;
  thang: number;
  nam: number;
  luongTheoNgayCong?: number;
  phuCap?: number;
  thuongKpi?: number;
  thuongKhac?: number;
  khauTru?: number;
  congTruCheDo?: number;
  tongLuong?: number;
  ngayTinhLuong?: string;
  nguoiTinhLuongId?: string;
  ghiChu?: string;
  id?: string;
}

export interface LuongNhanVienInListDto extends EntityDto<string> {
  nhanVienId?: string;
  thang: number;
  nam: number;
  luongTheoNgayCong?: number;
  phuCap?: number;
  thuongKpi?: number;
  thuongKhac?: number;
  khauTru?: number;
  congTruCheDo?: number;
  tongLuong?: number;
  ngayTinhLuong?: string;
  nguoiTinhLuongId?: string;
  ghiChu?: string;
  tenNhanVien?: string;
}

export interface LuongNhanVienListFilterDto extends BaseListFilterDto {
  nhanVienId?: string;
  thang: number;
  nam: number;
}
