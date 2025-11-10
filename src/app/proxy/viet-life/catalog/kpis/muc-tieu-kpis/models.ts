import type { EntityDto } from '@abp/ng.core';

export interface CreateUpdateMucTieuKpiDto {
  kpiNhanVienId?: string;
  keHoachCongViecId?: string;
  tenMucTieu?: string;
  giaTriMucTieu?: number;
  giaTriThucHien?: number;
  donVi?: string;
  trongSo: number;
}

export interface MucTieuKpiDto {
  kpiNhanVienId?: string;
  keHoachCongViecId?: string;
  tenMucTieu?: string;
  giaTriMucTieu?: number;
  giaTriThucHien?: number;
  donVi?: string;
  trongSo: number;
  id?: string;
}

export interface MucTieuKpiInListDto extends EntityDto<string> {
  kpiNhanVienId?: string;
  keHoachCongViecId?: string;
  tenMucTieu?: string;
  giaTriMucTieu?: number;
  giaTriThucHien?: number;
  donVi?: string;
  trongSo: number;
  tenKpi?: string;
  tenKeHoach?: string;
}
