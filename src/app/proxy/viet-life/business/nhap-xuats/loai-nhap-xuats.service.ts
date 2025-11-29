import type { CreateUpdateLoaiNhapXuatDto, LoaiNhapXuatDto, LoaiNhapXuatInListDto } from './loai-nhap-xuats/models';
import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto, PagedResultRequestDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { BaseListFilterDto } from '../../models';

@Injectable({
  providedIn: 'root',
})
export class LoaiNhapXuatsService {
  apiName = 'Default';
  

  create = (input: CreateUpdateLoaiNhapXuatDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, LoaiNhapXuatDto>({
      method: 'POST',
      url: '/api/app/loai-nhap-xuats',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/loai-nhap-xuats/${id}`,
    },
    { apiName: this.apiName,...config });
  

  deleteMultiple = (ids: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: '/api/app/loai-nhap-xuats/multiple',
      params: { ids },
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, LoaiNhapXuatDto>({
      method: 'GET',
      url: `/api/app/loai-nhap-xuats/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getList = (input: PagedResultRequestDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<LoaiNhapXuatDto>>({
      method: 'GET',
      url: '/api/app/loai-nhap-xuats',
      params: { skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  getListAll = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, LoaiNhapXuatInListDto[]>({
      method: 'GET',
      url: '/api/app/loai-nhap-xuats/all',
    },
    { apiName: this.apiName,...config });
  

  getListFilter = (input: BaseListFilterDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<LoaiNhapXuatInListDto>>({
      method: 'GET',
      url: '/api/app/loai-nhap-xuats/filter',
      params: { keyword: input.keyword, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: CreateUpdateLoaiNhapXuatDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, LoaiNhapXuatDto>({
      method: 'PUT',
      url: `/api/app/loai-nhap-xuats/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
