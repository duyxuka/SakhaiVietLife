import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto, PagedResultRequestDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { CreateUpdateDanhGiaKpiDto, DanhGiaKpiDto, DanhGiaKpiInListDto } from '../kpis/danh-gia-kpis/models';
import type { BaseListFilterDto } from '../../models';

@Injectable({
  providedIn: 'root',
})
export class DanhGiaKpisService {
  apiName = 'Default';
  

  create = (input: CreateUpdateDanhGiaKpiDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, DanhGiaKpiDto>({
      method: 'POST',
      url: '/api/app/danh-gia-kpis',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/danh-gia-kpis/${id}`,
    },
    { apiName: this.apiName,...config });
  

  deleteMultiple = (ids: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: '/api/app/danh-gia-kpis/multiple',
      params: { ids },
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, DanhGiaKpiDto>({
      method: 'GET',
      url: `/api/app/danh-gia-kpis/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getList = (input: PagedResultRequestDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<DanhGiaKpiDto>>({
      method: 'GET',
      url: '/api/app/danh-gia-kpis',
      params: { skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  getListAll = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, DanhGiaKpiInListDto[]>({
      method: 'GET',
      url: '/api/app/danh-gia-kpis/all',
    },
    { apiName: this.apiName,...config });
  

  getListFilter = (input: BaseListFilterDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<DanhGiaKpiInListDto>>({
      method: 'GET',
      url: '/api/app/danh-gia-kpis/filter',
      params: { keyword: input.keyword, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: CreateUpdateDanhGiaKpiDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, DanhGiaKpiDto>({
      method: 'PUT',
      url: `/api/app/danh-gia-kpis/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
