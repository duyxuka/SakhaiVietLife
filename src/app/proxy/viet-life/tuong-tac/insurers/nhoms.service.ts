import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto, PagedResultRequestDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { CreateUpdateNhomDto, NhomDto, NhomInListDto } from '../insurer/nhoms/models';
import type { BaseListFilterDto } from '../../models';

@Injectable({
  providedIn: 'root',
})
export class NhomsService {
  apiName = 'Default';
  

  create = (input: CreateUpdateNhomDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, NhomDto>({
      method: 'POST',
      url: '/api/app/nhoms',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/nhoms/${id}`,
    },
    { apiName: this.apiName,...config });
  

  deleteMultiple = (ids: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: '/api/app/nhoms/multiple',
      params: { ids },
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, NhomDto>({
      method: 'GET',
      url: `/api/app/nhoms/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getBySlug = (slug: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, NhomDto>({
      method: 'GET',
      url: '/api/app/nhoms/by-slug',
      params: { slug },
    },
    { apiName: this.apiName,...config });
  

  getList = (input: PagedResultRequestDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<NhomDto>>({
      method: 'GET',
      url: '/api/app/nhoms',
      params: { skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  getListAll = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, NhomInListDto[]>({
      method: 'GET',
      url: '/api/app/nhoms/all',
    },
    { apiName: this.apiName,...config });
  

  getListByDanhMuc = (danhMucId: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, NhomInListDto[]>({
      method: 'GET',
      url: `/api/app/nhoms/by-danh-muc/${danhMucId}`,
    },
    { apiName: this.apiName,...config });
  

  getListFilter = (input: BaseListFilterDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<NhomInListDto>>({
      method: 'GET',
      url: '/api/app/nhoms/filter',
      params: { keyword: input.keyword, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: CreateUpdateNhomDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, NhomDto>({
      method: 'PUT',
      url: `/api/app/nhoms/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
