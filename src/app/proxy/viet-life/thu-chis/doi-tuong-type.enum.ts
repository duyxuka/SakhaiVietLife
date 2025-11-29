import { mapEnumToOptions } from '@abp/ng.core';

export enum DoiTuongType {
  KhachHang = 0,
  NhaCungCap = 1,
  NhanVien = 2,
  Khac = 3,
}

export const doiTuongTypeOptions = mapEnumToOptions(DoiTuongType);
