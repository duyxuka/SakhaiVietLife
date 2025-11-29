import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto, PagedResultRequestDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { BaseListFilterDto } from '../../models';
import type { CreateUpdateTaiKhoanKeToanDto, TaiKhoanKeToanDto, TaiKhoanKeToanInListDto } from '../thu-chis-list/tai-khoan-ke-toans/models';

@Injectable({
  providedIn: 'root',
})
export class TaiKhoanKeToansService {
  apiName = 'Default';
  

  create = (input: CreateUpdateTaiKhoanKeToanDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, TaiKhoanKeToanDto>({
      method: 'POST',
      url: '/api/app/tai-khoan-ke-toans',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/tai-khoan-ke-toans/${id}`,
    },
    { apiName: this.apiName,...config });
  

  deleteMultiple = (ids: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: '/api/app/tai-khoan-ke-toans/multiple',
      params: { ids },
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, TaiKhoanKeToanDto>({
      method: 'GET',
      url: `/api/app/tai-khoan-ke-toans/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getList = (input: PagedResultRequestDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<TaiKhoanKeToanDto>>({
      method: 'GET',
      url: '/api/app/tai-khoan-ke-toans',
      params: { skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  getListAll = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, TaiKhoanKeToanInListDto[]>({
      method: 'GET',
      url: '/api/app/tai-khoan-ke-toans/all',
    },
    { apiName: this.apiName,...config });
  

  getListFilter = (input: BaseListFilterDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<TaiKhoanKeToanInListDto>>({
      method: 'GET',
      url: '/api/app/tai-khoan-ke-toans/filter',
      params: { keyword: input.keyword, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: CreateUpdateTaiKhoanKeToanDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, TaiKhoanKeToanDto>({
      method: 'PUT',
      url: `/api/app/tai-khoan-ke-toans/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
