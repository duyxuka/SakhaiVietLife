import type { CreateUpdateTinTucDto, TinTucDto, TinTucInListDto } from './models';
import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto, PagedResultRequestDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { BaseListFilterDto } from '../../models';

@Injectable({
  providedIn: 'root',
})
export class TinTucsService {
  apiName = 'Default';
  

  create = (input: CreateUpdateTinTucDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, TinTucDto>({
      method: 'POST',
      url: '/api/app/tin-tucs',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/tin-tucs/${id}`,
    },
    { apiName: this.apiName,...config });
  

  deleteMultiple = (ids: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: '/api/app/tin-tucs/multiple',
      params: { ids },
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, TinTucDto>({
      method: 'GET',
      url: `/api/app/tin-tucs/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getList = (input: PagedResultRequestDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<TinTucDto>>({
      method: 'GET',
      url: '/api/app/tin-tucs',
      params: { skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  getListAll = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, TinTucInListDto[]>({
      method: 'GET',
      url: '/api/app/tin-tucs/all',
    },
    { apiName: this.apiName,...config });
  

  getListFilter = (input: BaseListFilterDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<TinTucInListDto>>({
      method: 'GET',
      url: '/api/app/tin-tucs/filter',
      params: { keyword: input.keyword, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  getThumbnailImage = (fileName: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, string>({
      method: 'GET',
      responseType: 'text',
      url: '/api/app/tin-tucs/thumbnail-image',
      params: { fileName },
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: CreateUpdateTinTucDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, TinTucDto>({
      method: 'PUT',
      url: `/api/app/tin-tucs/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
