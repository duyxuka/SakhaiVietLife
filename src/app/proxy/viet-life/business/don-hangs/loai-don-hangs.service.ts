import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto, PagedResultRequestDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { CreateUpdateLoaiDonHangDto, LoaiDonHangDto, LoaiDonHangInListDto } from '../don-hangs-list/loai-don-hangs/models';
import type { BaseListFilterDto } from '../../models';

@Injectable({
  providedIn: 'root',
})
export class LoaiDonHangsService {
  apiName = 'Default';
  

  create = (input: CreateUpdateLoaiDonHangDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, LoaiDonHangDto>({
      method: 'POST',
      url: '/api/app/loai-don-hangs',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/loai-don-hangs/${id}`,
    },
    { apiName: this.apiName,...config });
  

  deleteMultiple = (ids: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: '/api/app/loai-don-hangs/multiple',
      params: { ids },
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, LoaiDonHangDto>({
      method: 'GET',
      url: `/api/app/loai-don-hangs/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getList = (input: PagedResultRequestDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<LoaiDonHangDto>>({
      method: 'GET',
      url: '/api/app/loai-don-hangs',
      params: { skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  getListAll = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, LoaiDonHangInListDto[]>({
      method: 'GET',
      url: '/api/app/loai-don-hangs/all',
    },
    { apiName: this.apiName,...config });
  

  getListFilter = (input: BaseListFilterDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<LoaiDonHangInListDto>>({
      method: 'GET',
      url: '/api/app/loai-don-hangs/filter',
      params: { keyword: input.keyword, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: CreateUpdateLoaiDonHangDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, LoaiDonHangDto>({
      method: 'PUT',
      url: `/api/app/loai-don-hangs/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
