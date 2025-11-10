import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto, PagedResultRequestDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { CreateUpdateKpiNhanVienDto, KpiNhanVienDto, KpiNhanVienInListDto } from '../kpis/kpi-nhan-viens/models';
import type { BaseListFilterDto } from '../../models';

@Injectable({
  providedIn: 'root',
})
export class KpiNhanViensService {
  apiName = 'Default';
  

  create = (input: CreateUpdateKpiNhanVienDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, KpiNhanVienDto>({
      method: 'POST',
      url: '/api/app/kpi-nhan-viens',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/kpi-nhan-viens/${id}`,
    },
    { apiName: this.apiName,...config });
  

  deleteMultiple = (ids: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: '/api/app/kpi-nhan-viens/multiple',
      params: { ids },
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, KpiNhanVienDto>({
      method: 'GET',
      url: `/api/app/kpi-nhan-viens/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getList = (input: PagedResultRequestDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<KpiNhanVienDto>>({
      method: 'GET',
      url: '/api/app/kpi-nhan-viens',
      params: { skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  getListAll = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, KpiNhanVienInListDto[]>({
      method: 'GET',
      url: '/api/app/kpi-nhan-viens/all',
    },
    { apiName: this.apiName,...config });
  

  getListFilter = (input: BaseListFilterDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<KpiNhanVienInListDto>>({
      method: 'GET',
      url: '/api/app/kpi-nhan-viens/filter',
      params: { keyword: input.keyword, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: CreateUpdateKpiNhanVienDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, KpiNhanVienDto>({
      method: 'PUT',
      url: `/api/app/kpi-nhan-viens/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
