import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto, PagedResultRequestDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { CreateUpdateKeHoachCongViecDto, KeHoachCongViecDto, KeHoachCongViecInListDto } from '../kpis/ke-hoach-cong-viecs/models';
import type { BaseListFilterDto } from '../../models';

@Injectable({
  providedIn: 'root',
})
export class KeHoachCongViecsService {
  apiName = 'Default';
  

  create = (input: CreateUpdateKeHoachCongViecDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, KeHoachCongViecDto>({
      method: 'POST',
      url: '/api/app/ke-hoach-cong-viecs',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/ke-hoach-cong-viecs/${id}`,
    },
    { apiName: this.apiName,...config });
  

  deleteMultiple = (ids: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: '/api/app/ke-hoach-cong-viecs/multiple',
      params: { ids },
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, KeHoachCongViecDto>({
      method: 'GET',
      url: `/api/app/ke-hoach-cong-viecs/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getList = (input: PagedResultRequestDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<KeHoachCongViecDto>>({
      method: 'GET',
      url: '/api/app/ke-hoach-cong-viecs',
      params: { skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  getListAll = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, KeHoachCongViecInListDto[]>({
      method: 'GET',
      url: '/api/app/ke-hoach-cong-viecs/all',
    },
    { apiName: this.apiName,...config });
  

  getListFilter = (input: BaseListFilterDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<KeHoachCongViecInListDto>>({
      method: 'GET',
      url: '/api/app/ke-hoach-cong-viecs/filter',
      params: { keyword: input.keyword, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: CreateUpdateKeHoachCongViecDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, KeHoachCongViecDto>({
      method: 'PUT',
      url: `/api/app/ke-hoach-cong-viecs/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
