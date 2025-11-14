import type { EntityDto } from '@abp/ng.core';

export interface CreateUpdateLoaiHopDongDto {
  tenLoai?: string;
  soThangMacDinh?: number;
  macDinh: boolean;
}

export interface LoaiHopDongDto {
  id?: string;
  tenLoai?: string;
  soThangMacDinh?: number;
  macDinh: boolean;
}

export interface LoaiHopDongInListDto extends EntityDto<string> {
  tenLoai?: string;
  soThangMacDinh?: number;
  macDinh: boolean;
}
