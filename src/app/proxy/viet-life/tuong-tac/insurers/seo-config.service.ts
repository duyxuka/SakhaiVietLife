import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto, PagedResultRequestDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { CreateUpdateSeoConfigDto, SeoConfigDto, SeoConfigInListDto } from '../insurer/seos/models';
import type { BaseListFilterDto } from '../../models';

@Injectable({
  providedIn: 'root',
})
export class SeoConfigService {
  apiName = 'Default';
  

  create = (input: CreateUpdateSeoConfigDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, SeoConfigDto>({
      method: 'POST',
      url: '/api/app/seo-config',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/seo-config/${id}`,
    },
    { apiName: this.apiName,...config });
  

  deleteMultiple = (ids: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: '/api/app/seo-config/multiple',
      params: { ids },
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, SeoConfigDto>({
      method: 'GET',
      url: `/api/app/seo-config/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getByPageKey = (pageKey: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, SeoConfigDto>({
      method: 'GET',
      url: '/api/app/seo-config/by-page-key',
      params: { pageKey },
    },
    { apiName: this.apiName,...config });
  

  getList = (input: PagedResultRequestDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<SeoConfigDto>>({
      method: 'GET',
      url: '/api/app/seo-config',
      params: { skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  getListAll = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, SeoConfigInListDto[]>({
      method: 'GET',
      url: '/api/app/seo-config/all',
    },
    { apiName: this.apiName,...config });
  

  getListFilter = (input: BaseListFilterDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<SeoConfigInListDto>>({
      method: 'GET',
      url: '/api/app/seo-config/filter',
      params: { keyword: input.keyword, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: CreateUpdateSeoConfigDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, SeoConfigDto>({
      method: 'PUT',
      url: `/api/app/seo-config/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
