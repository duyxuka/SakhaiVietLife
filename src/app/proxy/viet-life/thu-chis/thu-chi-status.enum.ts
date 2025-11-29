import { mapEnumToOptions } from '@abp/ng.core';

export enum ThuChiStatus {
  ChoDuyet = 0,
  DaDuyet = 1,
  Huy = 2,
}

export const thuChiStatusOptions = mapEnumToOptions(ThuChiStatus);
