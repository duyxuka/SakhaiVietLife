import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto, PagedResultRequestDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { CreateUpdateDanhMucDto, DanhMucDto, DanhMucInListDto, DanhMucMenuDto } from '../insurer/danh-mucs/models';
import type { BaseListFilterDto } from '../../models';

@Injectable({
  providedIn: 'root',
})
export class DanhMucsService {
  apiName = 'Default';
  

  create = (input: CreateUpdateDanhMucDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, DanhMucDto>({
      method: 'POST',
      url: '/api/app/danh-mucs',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/danh-mucs/${id}`,
    },
    { apiName: this.apiName,...config });
  

  deleteMultiple = (ids: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: '/api/app/danh-mucs/multiple',
      params: { ids },
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, DanhMucDto>({
      method: 'GET',
      url: `/api/app/danh-mucs/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getList = (input: PagedResultRequestDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<DanhMucDto>>({
      method: 'GET',
      url: '/api/app/danh-mucs',
      params: { skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  getListAll = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, DanhMucInListDto[]>({
      method: 'GET',
      url: '/api/app/danh-mucs/all',
    },
    { apiName: this.apiName,...config });
  

  getListFilter = (input: BaseListFilterDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<DanhMucInListDto>>({
      method: 'GET',
      url: '/api/app/danh-mucs/filter',
      params: { keyword: input.keyword, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  getMenu = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, DanhMucMenuDto[]>({
      method: 'GET',
      url: '/api/app/danh-mucs/menu',
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: CreateUpdateDanhMucDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, DanhMucDto>({
      method: 'PUT',
      url: `/api/app/danh-mucs/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
