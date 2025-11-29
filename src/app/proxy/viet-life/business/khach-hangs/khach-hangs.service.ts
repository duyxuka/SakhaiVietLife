import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto, PagedResultRequestDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { CreateUpdateKhachHangDto, KhachHangDto, KhachHangInListDto } from '../khach-hangs-list/khach-hangs/models';
import type { BaseListFilterDto } from '../../models';

@Injectable({
  providedIn: 'root',
})
export class KhachHangsService {
  apiName = 'Default';
  

  create = (input: CreateUpdateKhachHangDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, KhachHangDto>({
      method: 'POST',
      url: '/api/app/khach-hangs',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/khach-hangs/${id}`,
    },
    { apiName: this.apiName,...config });
  

  deleteMultiple = (ids: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: '/api/app/khach-hangs/multiple',
      params: { ids },
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, KhachHangDto>({
      method: 'GET',
      url: `/api/app/khach-hangs/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getList = (input: PagedResultRequestDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<KhachHangDto>>({
      method: 'GET',
      url: '/api/app/khach-hangs',
      params: { skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  getListAll = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, KhachHangInListDto[]>({
      method: 'GET',
      url: '/api/app/khach-hangs/all',
    },
    { apiName: this.apiName,...config });
  

  getListFilter = (input: BaseListFilterDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<KhachHangInListDto>>({
      method: 'GET',
      url: '/api/app/khach-hangs/filter',
      params: { keyword: input.keyword, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: CreateUpdateKhachHangDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, KhachHangDto>({
      method: 'PUT',
      url: `/api/app/khach-hangs/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
