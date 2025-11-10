import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto, PagedResultRequestDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { CreateUpdateMucTieuKpiDto, MucTieuKpiDto, MucTieuKpiInListDto } from '../kpis/muc-tieu-kpis/models';
import type { BaseListFilterDto } from '../../models';

@Injectable({
  providedIn: 'root',
})
export class MucTieuKpisService {
  apiName = 'Default';
  

  create = (input: CreateUpdateMucTieuKpiDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, MucTieuKpiDto>({
      method: 'POST',
      url: '/api/app/muc-tieu-kpis',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/muc-tieu-kpis/${id}`,
    },
    { apiName: this.apiName,...config });
  

  deleteMultiple = (ids: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: '/api/app/muc-tieu-kpis/multiple',
      params: { ids },
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, MucTieuKpiDto>({
      method: 'GET',
      url: `/api/app/muc-tieu-kpis/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getList = (input: PagedResultRequestDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<MucTieuKpiDto>>({
      method: 'GET',
      url: '/api/app/muc-tieu-kpis',
      params: { skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  getListAll = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, MucTieuKpiInListDto[]>({
      method: 'GET',
      url: '/api/app/muc-tieu-kpis/all',
    },
    { apiName: this.apiName,...config });
  

  getListFilter = (input: BaseListFilterDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<MucTieuKpiInListDto>>({
      method: 'GET',
      url: '/api/app/muc-tieu-kpis/filter',
      params: { keyword: input.keyword, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: CreateUpdateMucTieuKpiDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, MucTieuKpiDto>({
      method: 'PUT',
      url: `/api/app/muc-tieu-kpis/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
