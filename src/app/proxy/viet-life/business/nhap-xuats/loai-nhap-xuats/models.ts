import type { EntityDto } from '@abp/ng.core';

export interface CreateUpdateLoaiNhapXuatDto {
  tenLoai?: string;
  kieuNhapXuat: number;
  tangGiamTon: boolean;
}

export interface LoaiNhapXuatDto {
  id?: string;
  tenLoai?: string;
  kieuNhapXuat: number;
  tangGiamTon: boolean;
}

export interface LoaiNhapXuatInListDto extends EntityDto<string> {
  tenLoai?: string;
  kieuNhapXuat: number;
  tangGiamTon: boolean;
}
