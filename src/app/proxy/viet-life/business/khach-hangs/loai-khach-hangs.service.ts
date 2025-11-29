import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto, PagedResultRequestDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { CreateUpdateLoaiKhachHangDto, LoaiKhachHangDto, LoaiKhachHangInListDto } from '../khach-hangs-list/loai-khach-hangs/models';
import type { BaseListFilterDto } from '../../models';

@Injectable({
  providedIn: 'root',
})
export class LoaiKhachHangsService {
  apiName = 'Default';
  

  create = (input: CreateUpdateLoaiKhachHangDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, LoaiKhachHangDto>({
      method: 'POST',
      url: '/api/app/loai-khach-hangs',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/loai-khach-hangs/${id}`,
    },
    { apiName: this.apiName,...config });
  

  deleteMultiple = (ids: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: '/api/app/loai-khach-hangs/multiple',
      params: { ids },
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, LoaiKhachHangDto>({
      method: 'GET',
      url: `/api/app/loai-khach-hangs/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getList = (input: PagedResultRequestDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<LoaiKhachHangDto>>({
      method: 'GET',
      url: '/api/app/loai-khach-hangs',
      params: { skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  getListAll = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, LoaiKhachHangInListDto[]>({
      method: 'GET',
      url: '/api/app/loai-khach-hangs/all',
    },
    { apiName: this.apiName,...config });
  

  getListFilter = (input: BaseListFilterDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<LoaiKhachHangInListDto>>({
      method: 'GET',
      url: '/api/app/loai-khach-hangs/filter',
      params: { keyword: input.keyword, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: CreateUpdateLoaiKhachHangDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, LoaiKhachHangDto>({
      method: 'PUT',
      url: `/api/app/loai-khach-hangs/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
