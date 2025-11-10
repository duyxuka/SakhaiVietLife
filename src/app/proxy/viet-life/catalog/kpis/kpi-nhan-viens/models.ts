import type { EntityDto } from '@abp/ng.core';

export interface CreateUpdateKpiNhanVienDto {
  nhanVienId?: string;
  thang: number;
  nam: number;
  mucLuongKpi?: number;
  phanTramHoanThanh?: number;
  diemKpi?: number;
  mucXepLoai?: string;
  thuongKpi?: number;
  nguoiDanhGiaId?: string;
  ghiChu?: string;
}

export interface KpiNhanVienDto {
  nhanVienId?: string;
  thang: number;
  nam: number;
  mucLuongKpi?: number;
  phanTramHoanThanh?: number;
  diemKpi?: number;
  mucXepLoai?: string;
  thuongKpi?: number;
  nguoiDanhGiaId?: string;
  ghiChu?: string;
  id?: string;
}

export interface KpiNhanVienInListDto extends EntityDto<string> {
  nhanVienId?: string;
  thang: number;
  nam: number;
  mucLuongKpi?: number;
  phanTramHoanThanh?: number;
  diemKpi?: number;
  mucXepLoai?: string;
  thuongKpi?: number;
  nguoiDanhGiaId?: string;
  ghiChu?: string;
  tenNhanVien?: string;
  tenNguoiDanhGia?: string;
}
