import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto, PagedResultRequestDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { BaseListFilterDto } from '../../models';
import type { CreateUpdateLoaiThuChiDto, LoaiThuChiDto, LoaiThuChiInListDto } from '../thu-chis-list/loai-thu-chis/models';

@Injectable({
  providedIn: 'root',
})
export class LoaiThuChisService {
  apiName = 'Default';
  

  create = (input: CreateUpdateLoaiThuChiDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, LoaiThuChiDto>({
      method: 'POST',
      url: '/api/app/loai-thu-chis',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/loai-thu-chis/${id}`,
    },
    { apiName: this.apiName,...config });
  

  deleteMultiple = (ids: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: '/api/app/loai-thu-chis/multiple',
      params: { ids },
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, LoaiThuChiDto>({
      method: 'GET',
      url: `/api/app/loai-thu-chis/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getList = (input: PagedResultRequestDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<LoaiThuChiDto>>({
      method: 'GET',
      url: '/api/app/loai-thu-chis',
      params: { skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  getListAll = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, LoaiThuChiInListDto[]>({
      method: 'GET',
      url: '/api/app/loai-thu-chis/all',
    },
    { apiName: this.apiName,...config });
  

  getListFilter = (input: BaseListFilterDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<LoaiThuChiInListDto>>({
      method: 'GET',
      url: '/api/app/loai-thu-chis/filter',
      params: { keyword: input.keyword, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: CreateUpdateLoaiThuChiDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, LoaiThuChiDto>({
      method: 'PUT',
      url: `/api/app/loai-thu-chis/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
