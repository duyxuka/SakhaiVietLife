import type { CreateUpdateHopDongNhanVienDto, HopDongNhanVienDto, HopDongNhanVienInListDto } from './hop-dong-nhan-viens/models';
import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto, PagedResultRequestDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { BaseListFilterDto } from '../../models';

@Injectable({
  providedIn: 'root',
})
export class HopDongNhanViensService {
  apiName = 'Default';
  

  create = (input: CreateUpdateHopDongNhanVienDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, HopDongNhanVienDto>({
      method: 'POST',
      url: '/api/app/hop-dong-nhan-viens',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/hop-dong-nhan-viens/${id}`,
    },
    { apiName: this.apiName,...config });
  

  deleteMultiple = (ids: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: '/api/app/hop-dong-nhan-viens/multiple',
      params: { ids },
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, HopDongNhanVienDto>({
      method: 'GET',
      url: `/api/app/hop-dong-nhan-viens/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getList = (input: PagedResultRequestDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<HopDongNhanVienDto>>({
      method: 'GET',
      url: '/api/app/hop-dong-nhan-viens',
      params: { skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  getListAll = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, HopDongNhanVienInListDto[]>({
      method: 'GET',
      url: '/api/app/hop-dong-nhan-viens/all',
    },
    { apiName: this.apiName,...config });
  

  getListFilter = (input: BaseListFilterDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<HopDongNhanVienInListDto>>({
      method: 'GET',
      url: '/api/app/hop-dong-nhan-viens/filter',
      params: { keyword: input.keyword, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: CreateUpdateHopDongNhanVienDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, HopDongNhanVienDto>({
      method: 'PUT',
      url: `/api/app/hop-dong-nhan-viens/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
