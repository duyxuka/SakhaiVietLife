import type { CreateUpdateThanhPhoDto, ThanhPhoDto, ThanhPhoInListDto } from './models';
import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto, PagedResultRequestDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { BaseListFilterDto } from '../../models';

@Injectable({
  providedIn: 'root',
})
export class ThanhPhosService {
  apiName = 'Default';
  

  create = (input: CreateUpdateThanhPhoDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ThanhPhoDto>({
      method: 'POST',
      url: '/api/app/thanh-phos',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/thanh-phos/${id}`,
    },
    { apiName: this.apiName,...config });
  

  deleteMultiple = (ids: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: '/api/app/thanh-phos/multiple',
      params: { ids },
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ThanhPhoDto>({
      method: 'GET',
      url: `/api/app/thanh-phos/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getList = (input: PagedResultRequestDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<ThanhPhoDto>>({
      method: 'GET',
      url: '/api/app/thanh-phos',
      params: { skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  getListAll = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, ThanhPhoInListDto[]>({
      method: 'GET',
      url: '/api/app/thanh-phos/all',
    },
    { apiName: this.apiName,...config });
  

  getListFilter = (input: BaseListFilterDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<ThanhPhoInListDto>>({
      method: 'GET',
      url: '/api/app/thanh-phos/filter',
      params: { keyword: input.keyword, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: CreateUpdateThanhPhoDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ThanhPhoDto>({
      method: 'PUT',
      url: `/api/app/thanh-phos/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
