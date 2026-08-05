import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto, PagedResultRequestDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { CreateUpdateDangKyTuVanDto, DangKyTuVanDto, DangKyTuVanInListDto } from '../insurer/dang-ky-tu-vans/models';
import type { BaseListFilterDto } from '../../models';

@Injectable({
  providedIn: 'root',
})
export class DangKyTuVansService {
  apiName = 'Default';
  

  create = (input: CreateUpdateDangKyTuVanDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, DangKyTuVanDto>({
      method: 'POST',
      url: '/api/app/dang-ky-tu-vans',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/dang-ky-tu-vans/${id}`,
    },
    { apiName: this.apiName,...config });
  

  deleteMultiple = (ids: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: '/api/app/dang-ky-tu-vans/multiple',
      params: { ids },
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, DangKyTuVanDto>({
      method: 'GET',
      url: `/api/app/dang-ky-tu-vans/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getList = (input: PagedResultRequestDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<DangKyTuVanDto>>({
      method: 'GET',
      url: '/api/app/dang-ky-tu-vans',
      params: { skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  getListAll = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, DangKyTuVanInListDto[]>({
      method: 'GET',
      url: '/api/app/dang-ky-tu-vans/all',
    },
    { apiName: this.apiName,...config });
  

  getListByNhom = (nhomId: string, input: PagedResultRequestDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<DangKyTuVanInListDto>>({
      method: 'GET',
      url: `/api/app/dang-ky-tu-vans/by-nhom/${nhomId}`,
      params: { skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  getListBySanPham = (sanPhamId: string, input: PagedResultRequestDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<DangKyTuVanInListDto>>({
      method: 'GET',
      url: `/api/app/dang-ky-tu-vans/by-san-pham/${sanPhamId}`,
      params: { skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  getListFilter = (input: BaseListFilterDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<DangKyTuVanInListDto>>({
      method: 'GET',
      url: '/api/app/dang-ky-tu-vans/filter',
      params: { keyword: input.keyword, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: CreateUpdateDangKyTuVanDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, DangKyTuVanDto>({
      method: 'PUT',
      url: `/api/app/dang-ky-tu-vans/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
