import type { EntityDto } from '@abp/ng.core';

export interface CreateUpdateKeHoachCongViecDto {
  kpiNhanVienId?: string;
  tenKeHoach?: string;
  moTa?: string;
  ngayBatDau?: string;
  ngayKetThuc?: string;
  trongSo: number;
}

export interface KeHoachCongViecDto {
  kpiNhanVienId?: string;
  tenKeHoach?: string;
  moTa?: string;
  ngayBatDau?: string;
  ngayKetThuc?: string;
  trongSo: number;
  id?: string;
}

export interface KeHoachCongViecInListDto extends EntityDto<string> {
  kpiNhanVienId?: string;
  tenKeHoach?: string;
  moTa?: string;
  ngayBatDau?: string;
  ngayKetThuc?: string;
  trongSo: number;
  soMucTieu: number;
  tenKpi?: string;
  tenNhanVien?: string;
}
