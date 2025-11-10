import type { CreateUpdatePhongBanDto, PhongBanDto, PhongBanInListDto } from './models';
import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto, PagedResultRequestDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { BaseListFilterDto } from '../../models';

@Injectable({
  providedIn: 'root',
})
export class PhongBansService {
  apiName = 'Default';
  

  create = (input: CreateUpdatePhongBanDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PhongBanDto>({
      method: 'POST',
      url: '/api/app/phong-bans',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/phong-bans/${id}`,
    },
    { apiName: this.apiName,...config });
  

  deleteMultiple = (ids: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: '/api/app/phong-bans/multiple',
      params: { ids },
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PhongBanDto>({
      method: 'GET',
      url: `/api/app/phong-bans/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getList = (input: PagedResultRequestDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<PhongBanDto>>({
      method: 'GET',
      url: '/api/app/phong-bans',
      params: { skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  getListAll = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, PhongBanInListDto[]>({
      method: 'GET',
      url: '/api/app/phong-bans/all',
    },
    { apiName: this.apiName,...config });
  

  getListFilter = (input: BaseListFilterDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<PhongBanInListDto>>({
      method: 'GET',
      url: '/api/app/phong-bans/filter',
      params: { keyword: input.keyword, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: CreateUpdatePhongBanDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PhongBanDto>({
      method: 'PUT',
      url: `/api/app/phong-bans/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
