import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto, PagedResultRequestDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { BaseListFilterDto } from '../../models';
import type { CreateUpdateThuChiDto, ThuChiDto, ThuChiInListDto } from '../thu-chis-list/thu-chis/models';

@Injectable({
  providedIn: 'root',
})
export class ThuChisService {
  apiName = 'Default';
  

  create = (input: CreateUpdateThuChiDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ThuChiDto>({
      method: 'POST',
      url: '/api/app/thu-chis',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/thu-chis/${id}`,
    },
    { apiName: this.apiName,...config });
  

  deleteMultiple = (ids: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: '/api/app/thu-chis/multiple',
      params: { ids },
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ThuChiDto>({
      method: 'GET',
      url: `/api/app/thu-chis/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getList = (input: PagedResultRequestDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<ThuChiDto>>({
      method: 'GET',
      url: '/api/app/thu-chis',
      params: { skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  getListAll = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, ThuChiInListDto[]>({
      method: 'GET',
      url: '/api/app/thu-chis/all',
    },
    { apiName: this.apiName,...config });
  

  getListFilter = (input: BaseListFilterDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<ThuChiInListDto>>({
      method: 'GET',
      url: '/api/app/thu-chis/filter',
      params: { keyword: input.keyword, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: CreateUpdateThuChiDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ThuChiDto>({
      method: 'PUT',
      url: `/api/app/thu-chis/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
