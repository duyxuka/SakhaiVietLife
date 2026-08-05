import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto, PagedResultRequestDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { BaiVietDto, BaiVietInListDto, CreateUpdateBaiVietDto } from '../insurer/bai-viets/models';
import type { BaseListFilterDto } from '../../models';

@Injectable({
  providedIn: 'root',
})
export class BaiVietsService {
  apiName = 'Default';
  

  create = (input: CreateUpdateBaiVietDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, BaiVietDto>({
      method: 'POST',
      url: '/api/app/bai-viets',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/bai-viets/${id}`,
    },
    { apiName: this.apiName,...config });
  

  deleteMultiple = (ids: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: '/api/app/bai-viets/multiple',
      params: { ids },
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, BaiVietDto>({
      method: 'GET',
      url: `/api/app/bai-viets/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getBySlug = (slug: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, BaiVietDto>({
      method: 'GET',
      url: '/api/app/bai-viets/by-slug',
      params: { slug },
    },
    { apiName: this.apiName,...config });
  

  getLatest = (take: number = 6, config?: Partial<Rest.Config>) =>
    this.restService.request<any, BaiVietInListDto[]>({
      method: 'GET',
      url: '/api/app/bai-viets/latest',
      params: { take },
    },
    { apiName: this.apiName,...config });
  

  getList = (input: PagedResultRequestDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<BaiVietDto>>({
      method: 'GET',
      url: '/api/app/bai-viets',
      params: { skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  getListAll = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, BaiVietInListDto[]>({
      method: 'GET',
      url: '/api/app/bai-viets/all',
    },
    { apiName: this.apiName,...config });
  

  getListByNhom = (nhomId: string, input: PagedResultRequestDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<BaiVietInListDto>>({
      method: 'GET',
      url: `/api/app/bai-viets/by-nhom/${nhomId}`,
      params: { skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  getListBySanPham = (sanPhamId: string, input: PagedResultRequestDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<BaiVietInListDto>>({
      method: 'GET',
      url: `/api/app/bai-viets/by-san-pham/${sanPhamId}`,
      params: { skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  getListFilter = (input: BaseListFilterDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<BaiVietInListDto>>({
      method: 'GET',
      url: '/api/app/bai-viets/filter',
      params: { keyword: input.keyword, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: CreateUpdateBaiVietDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, BaiVietDto>({
      method: 'PUT',
      url: `/api/app/bai-viets/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
