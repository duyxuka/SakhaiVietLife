import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto, PagedResultRequestDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { CreateUpdateSanPhamInsurerDto, SanPhamInsurerDto, SanPhamInsurerInListDto } from '../insurer/san-pham-insurers/models';
import type { BaseListFilterDto } from '../../models';

@Injectable({
  providedIn: 'root',
})
export class SanPhamInsurersService {
  apiName = 'Default';
  

  create = (input: CreateUpdateSanPhamInsurerDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, SanPhamInsurerDto>({
      method: 'POST',
      url: '/api/app/san-pham-insurers',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/san-pham-insurers/${id}`,
    },
    { apiName: this.apiName,...config });
  

  deleteMultiple = (ids: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: '/api/app/san-pham-insurers/multiple',
      params: { ids },
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, SanPhamInsurerDto>({
      method: 'GET',
      url: `/api/app/san-pham-insurers/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getBySlug = (slug: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, SanPhamInsurerDto>({
      method: 'GET',
      url: '/api/app/san-pham-insurers/by-slug',
      params: { slug },
    },
    { apiName: this.apiName,...config });
  

  getList = (input: PagedResultRequestDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<SanPhamInsurerDto>>({
      method: 'GET',
      url: '/api/app/san-pham-insurers',
      params: { skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  getListAll = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, SanPhamInsurerInListDto[]>({
      method: 'GET',
      url: '/api/app/san-pham-insurers/all',
    },
    { apiName: this.apiName,...config });
  

  getListByNhom = (nhomId: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, SanPhamInsurerInListDto[]>({
      method: 'GET',
      url: `/api/app/san-pham-insurers/by-nhom/${nhomId}`,
    },
    { apiName: this.apiName,...config });
  

  getListFilter = (input: BaseListFilterDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<SanPhamInsurerInListDto>>({
      method: 'GET',
      url: '/api/app/san-pham-insurers/filter',
      params: { keyword: input.keyword, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  getThumbnailImage = (fileName: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, string>({
      method: 'GET',
      responseType: 'text',
      url: '/api/app/san-pham-insurers/thumbnail-image',
      params: { fileName },
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: CreateUpdateSanPhamInsurerDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, SanPhamInsurerDto>({
      method: 'PUT',
      url: `/api/app/san-pham-insurers/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
