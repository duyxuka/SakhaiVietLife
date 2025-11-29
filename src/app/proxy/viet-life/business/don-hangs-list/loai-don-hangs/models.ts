import type { EntityDto } from '@abp/ng.core';

export interface CreateUpdateLoaiDonHangDto {
  tenLoai?: string;
  hieuLuc: boolean;
  tuDongXuatKho: boolean;
}

export interface LoaiDonHangDto {
  id?: string;
  tenLoai?: string;
  hieuLuc: boolean;
  tuDongXuatKho: boolean;
}

export interface LoaiDonHangInListDto extends EntityDto<string> {
  tenLoai?: string;
  hieuLuc: boolean;
  tuDongXuatKho: boolean;
}
