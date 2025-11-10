import type { EntityDto } from '@abp/ng.core';

export interface CreateUpdateTienDoLamViecDto {
  kpiNhanVienId?: string;
  ngayCapNhat?: string;
  phanTramTienDo?: number;
  ghiChu?: string;
}

export interface TienDoLamViecDto {
  kpiNhanVienId?: string;
  ngayCapNhat?: string;
  phanTramTienDo?: number;
  ghiChu?: string;
  id?: string;
}

export interface TienDoLamViecInListDto extends EntityDto<string> {
  kpiNhanVienId?: string;
  ngayCapNhat?: string;
  phanTramTienDo?: number;
  ghiChu?: string;
  tenNhanVien?: string;
  tenKpi?: string;
}
