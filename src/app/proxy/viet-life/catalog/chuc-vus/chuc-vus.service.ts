import type { ChucVuDto, ChucVuInListDto, CreateUpdateChucVuDto } from './models';
import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto, PagedResultRequestDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { BaseListFilterDto } from '../../models';

@Injectable({
  providedIn: 'root',
})
export class ChucVusService {
  apiName = 'Default';
  

  create = (input: CreateUpdateChucVuDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ChucVuDto>({
      method: 'POST',
      url: '/api/app/chuc-vus',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/chuc-vus/${id}`,
    },
    { apiName: this.apiName,...config });
  

  deleteMultiple = (ids: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: '/api/app/chuc-vus/multiple',
      params: { ids },
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ChucVuDto>({
      method: 'GET',
      url: `/api/app/chuc-vus/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getList = (input: PagedResultRequestDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<ChucVuDto>>({
      method: 'GET',
      url: '/api/app/chuc-vus',
      params: { skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  getListAll = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, ChucVuInListDto[]>({
      method: 'GET',
      url: '/api/app/chuc-vus/all',
    },
    { apiName: this.apiName,...config });
  

  getListFilter = (input: BaseListFilterDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<ChucVuInListDto>>({
      method: 'GET',
      url: '/api/app/chuc-vus/filter',
      params: { keyword: input.keyword, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: CreateUpdateChucVuDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ChucVuDto>({
      method: 'PUT',
      url: `/api/app/chuc-vus/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
