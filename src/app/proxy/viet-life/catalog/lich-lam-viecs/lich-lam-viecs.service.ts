import type { CreateUpdateLichLamViecDto, LichLamViecDto, LichLamViecInListDto, LichLamViecListFilterDto } from './models';
import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto, PagedResultRequestDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LichLamViecsService {
  apiName = 'Default';
  

  create = (input: CreateUpdateLichLamViecDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, LichLamViecDto>({
      method: 'POST',
      url: '/api/app/lich-lam-viecs',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/lich-lam-viecs/${id}`,
    },
    { apiName: this.apiName,...config });
  

  deleteMultiple = (ids: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: '/api/app/lich-lam-viecs/multiple',
      params: { ids },
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, LichLamViecDto>({
      method: 'GET',
      url: `/api/app/lich-lam-viecs/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getList = (input: PagedResultRequestDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<LichLamViecDto>>({
      method: 'GET',
      url: '/api/app/lich-lam-viecs',
      params: { skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  getListAll = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, LichLamViecInListDto[]>({
      method: 'GET',
      url: '/api/app/lich-lam-viecs/all',
    },
    { apiName: this.apiName,...config });
  

  getListFilter = (input: LichLamViecListFilterDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<LichLamViecInListDto>>({
      method: 'GET',
      url: '/api/app/lich-lam-viecs/filter',
      params: { startDate: input.startDate, endDate: input.endDate, keyword: input.keyword, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: CreateUpdateLichLamViecDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, LichLamViecDto>({
      method: 'PUT',
      url: `/api/app/lich-lam-viecs/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
