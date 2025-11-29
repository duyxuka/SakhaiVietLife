import type { CreateUpdateKhoHangDto, KhoHangDto, KhoHangInListDto } from './models';
import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto, PagedResultRequestDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { BaseListFilterDto } from '../../models';

@Injectable({
  providedIn: 'root',
})
export class KhoHangsService {
  apiName = 'Default';
  

  create = (input: CreateUpdateKhoHangDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, KhoHangDto>({
      method: 'POST',
      url: '/api/app/kho-hangs',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/kho-hangs/${id}`,
    },
    { apiName: this.apiName,...config });
  

  deleteMultiple = (ids: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: '/api/app/kho-hangs/multiple',
      params: { ids },
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, KhoHangDto>({
      method: 'GET',
      url: `/api/app/kho-hangs/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getList = (input: PagedResultRequestDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<KhoHangDto>>({
      method: 'GET',
      url: '/api/app/kho-hangs',
      params: { skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  getListAll = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, KhoHangInListDto[]>({
      method: 'GET',
      url: '/api/app/kho-hangs/all',
    },
    { apiName: this.apiName,...config });
  

  getListFilter = (input: BaseListFilterDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<KhoHangInListDto>>({
      method: 'GET',
      url: '/api/app/kho-hangs/filter',
      params: { keyword: input.keyword, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: CreateUpdateKhoHangDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, KhoHangDto>({
      method: 'PUT',
      url: `/api/app/kho-hangs/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
