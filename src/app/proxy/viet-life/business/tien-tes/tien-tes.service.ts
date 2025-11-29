import type { CreateUpdateTienTeDto, TienTeDto, TienTeInListDto } from './models';
import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto, PagedResultRequestDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { BaseListFilterDto } from '../../models';

@Injectable({
  providedIn: 'root',
})
export class TienTesService {
  apiName = 'Default';
  

  create = (input: CreateUpdateTienTeDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, TienTeDto>({
      method: 'POST',
      url: '/api/app/tien-tes',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/tien-tes/${id}`,
    },
    { apiName: this.apiName,...config });
  

  deleteMultiple = (ids: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: '/api/app/tien-tes/multiple',
      params: { ids },
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, TienTeDto>({
      method: 'GET',
      url: `/api/app/tien-tes/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getList = (input: PagedResultRequestDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<TienTeDto>>({
      method: 'GET',
      url: '/api/app/tien-tes',
      params: { skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  getListAll = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, TienTeInListDto[]>({
      method: 'GET',
      url: '/api/app/tien-tes/all',
    },
    { apiName: this.apiName,...config });
  

  getListFilter = (input: BaseListFilterDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<TienTeInListDto>>({
      method: 'GET',
      url: '/api/app/tien-tes/filter',
      params: { keyword: input.keyword, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: CreateUpdateTienTeDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, TienTeDto>({
      method: 'PUT',
      url: `/api/app/tien-tes/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
