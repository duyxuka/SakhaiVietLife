import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto, PagedResultRequestDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { CreateUpdateLoaiCheDoDto, LoaiCheDoDto, LoaiCheDoInListDto } from '../che-dos/loai-che-dos/models';
import type { BaseListFilterDto } from '../../models';

@Injectable({
  providedIn: 'root',
})
export class LoaiCheDosService {
  apiName = 'Default';
  

  create = (input: CreateUpdateLoaiCheDoDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, LoaiCheDoDto>({
      method: 'POST',
      url: '/api/app/loai-che-dos',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/loai-che-dos/${id}`,
    },
    { apiName: this.apiName,...config });
  

  deleteMultiple = (ids: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: '/api/app/loai-che-dos/multiple',
      params: { ids },
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, LoaiCheDoDto>({
      method: 'GET',
      url: `/api/app/loai-che-dos/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getList = (input: PagedResultRequestDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<LoaiCheDoDto>>({
      method: 'GET',
      url: '/api/app/loai-che-dos',
      params: { skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  getListAll = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, LoaiCheDoInListDto[]>({
      method: 'GET',
      url: '/api/app/loai-che-dos/all',
    },
    { apiName: this.apiName,...config });
  

  getListFilter = (input: BaseListFilterDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<LoaiCheDoInListDto>>({
      method: 'GET',
      url: '/api/app/loai-che-dos/filter',
      params: { keyword: input.keyword, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: CreateUpdateLoaiCheDoDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, LoaiCheDoDto>({
      method: 'PUT',
      url: `/api/app/loai-che-dos/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
