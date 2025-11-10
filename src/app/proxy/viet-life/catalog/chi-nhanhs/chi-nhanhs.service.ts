import type { ChiNhanhDto, ChiNhanhInListDto, CreateUpdateChiNhanhDto } from './models';
import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto, PagedResultRequestDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { BaseListFilterDto } from '../../models';

@Injectable({
  providedIn: 'root',
})
export class ChiNhanhsService {
  apiName = 'Default';
  

  create = (input: CreateUpdateChiNhanhDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ChiNhanhDto>({
      method: 'POST',
      url: '/api/app/chi-nhanhs',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/chi-nhanhs/${id}`,
    },
    { apiName: this.apiName,...config });
  

  deleteMultiple = (ids: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: '/api/app/chi-nhanhs/multiple',
      params: { ids },
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ChiNhanhDto>({
      method: 'GET',
      url: `/api/app/chi-nhanhs/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getList = (input: PagedResultRequestDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<ChiNhanhDto>>({
      method: 'GET',
      url: '/api/app/chi-nhanhs',
      params: { skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  getListAll = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, ChiNhanhInListDto[]>({
      method: 'GET',
      url: '/api/app/chi-nhanhs/all',
    },
    { apiName: this.apiName,...config });
  

  getListFilter = (input: BaseListFilterDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<ChiNhanhInListDto>>({
      method: 'GET',
      url: '/api/app/chi-nhanhs/filter',
      params: { keyword: input.keyword, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: CreateUpdateChiNhanhDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ChiNhanhDto>({
      method: 'PUT',
      url: `/api/app/chi-nhanhs/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
