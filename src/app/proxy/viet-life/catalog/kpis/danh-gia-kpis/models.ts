import type { EntityDto } from '@abp/ng.core';

export interface CreateUpdateDanhGiaKpiDto {
  kpiNhanVienId?: string;
  diemDanhGia?: number;
  nhanXet?: string;
  nguoiDanhGiaId?: string;
}

export interface DanhGiaKpiDto {
  kpiNhanVienId?: string;
  diemDanhGia?: number;
  nhanXet?: string;
  nguoiDanhGiaId?: string;
  id?: string;
}

export interface DanhGiaKpiInListDto extends EntityDto<string> {
  kpiNhanVienId?: string;
  diemDanhGia?: number;
  nhanXet?: string;
  nguoiDanhGiaId?: string;
  tenKpi?: string;
  tenNhanVien?: string;
  tenNguoiDanhGia?: string;
}
