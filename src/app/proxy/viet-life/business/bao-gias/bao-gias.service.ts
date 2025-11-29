import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto, PagedResultRequestDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { BaoGiaDto, BaoGiaInListDto, CreateUpdateBaoGiaDto } from '../bao-gias-list/bao-gias/models';
import type { BaseListFilterDto } from '../../models';

@Injectable({
  providedIn: 'root',
})
export class BaoGiasService {
  apiName = 'Default';
  

  create = (input: CreateUpdateBaoGiaDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, BaoGiaDto>({
      method: 'POST',
      url: '/api/app/bao-gias',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/bao-gias/${id}`,
    },
    { apiName: this.apiName,...config });
  

  deleteMultiple = (ids: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: '/api/app/bao-gias/multiple',
      params: { ids },
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, BaoGiaDto>({
      method: 'GET',
      url: `/api/app/bao-gias/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getList = (input: PagedResultRequestDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<BaoGiaDto>>({
      method: 'GET',
      url: '/api/app/bao-gias',
      params: { skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  getListAll = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, BaoGiaInListDto[]>({
      method: 'GET',
      url: '/api/app/bao-gias/all',
    },
    { apiName: this.apiName,...config });
  

  getListFilter = (input: BaseListFilterDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<BaoGiaInListDto>>({
      method: 'GET',
      url: '/api/app/bao-gias/filter',
      params: { keyword: input.keyword, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: CreateUpdateBaoGiaDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, BaoGiaDto>({
      method: 'PUT',
      url: `/api/app/bao-gias/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
