import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto, PagedResultRequestDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { BaseListFilterDto } from '../../models';
import type { CreateUpdateNhomSanPhamDto, NhomSanPhamDto, NhomSanPhamInListDto } from '../san-phams-list/nhom-san-phams/models';

@Injectable({
  providedIn: 'root',
})
export class NhomSanPhamsService {
  apiName = 'Default';
  

  create = (input: CreateUpdateNhomSanPhamDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, NhomSanPhamDto>({
      method: 'POST',
      url: '/api/app/nhom-san-phams',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/nhom-san-phams/${id}`,
    },
    { apiName: this.apiName,...config });
  

  deleteMultiple = (ids: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: '/api/app/nhom-san-phams/multiple',
      params: { ids },
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, NhomSanPhamDto>({
      method: 'GET',
      url: `/api/app/nhom-san-phams/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getList = (input: PagedResultRequestDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<NhomSanPhamDto>>({
      method: 'GET',
      url: '/api/app/nhom-san-phams',
      params: { skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  getListAll = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, NhomSanPhamInListDto[]>({
      method: 'GET',
      url: '/api/app/nhom-san-phams/all',
    },
    { apiName: this.apiName,...config });
  

  getListFilter = (input: BaseListFilterDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<NhomSanPhamInListDto>>({
      method: 'GET',
      url: '/api/app/nhom-san-phams/filter',
      params: { keyword: input.keyword, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: CreateUpdateNhomSanPhamDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, NhomSanPhamDto>({
      method: 'PUT',
      url: `/api/app/nhom-san-phams/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
