import type { EntityDto } from '@abp/ng.core';

export interface CreateUpdateDangKyTuVanDto {
  sanPhamId?: string;
  nhomId?: string;
  hoTen?: string;
  soDienThoai?: string;
}

export interface DangKyTuVanDto {
  id?: string;
  nhomId?: string;
  sanPhamId?: string;
  sanPhamTen?: string;
  nhomTen?: string;
  hoTen?: string;
  soDienThoai?: string;
}

export interface DangKyTuVanInListDto extends EntityDto<string> {
  nhomId?: string;
  nhomTen?: string;
  sanPhamId?: string;
  sanPhamTen?: string;
  hoTen?: string;
  soDienThoai?: string;
  creationTime?: string;
}
