import { mapEnumToOptions } from '@abp/ng.core';

export enum PaymentMethod {
  TienMat = 0,
  ChuyenKhoan = 1,
  POS = 2,
  ViDienTu = 3,
}

export const paymentMethodOptions = mapEnumToOptions(PaymentMethod);
