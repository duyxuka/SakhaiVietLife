import type { CreateUpdateLoaiHopDongDto, LoaiHopDongDto, LoaiHopDongInListDto } from './loai-hop-dongs/models';
import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto, PagedResultRequestDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { BaseListFilterDto } from '../../models';

@Injectable({
  providedIn: 'root',
})
export class LoaiHopDongsService {
  apiName = 'Default';
  

  create = (input: CreateUpdateLoaiHopDongDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, LoaiHopDongDto>({
      method: 'POST',
      url: '/api/app/loai-hop-dongs',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/loai-hop-dongs/${id}`,
    },
    { apiName: this.apiName,...config });
  

  deleteMultiple = (ids: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: '/api/app/loai-hop-dongs/multiple',
      params: { ids },
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, LoaiHopDongDto>({
      method: 'GET',
      url: `/api/app/loai-hop-dongs/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getList = (input: PagedResultRequestDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<LoaiHopDongDto>>({
      method: 'GET',
      url: '/api/app/loai-hop-dongs',
      params: { skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  getListAll = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, LoaiHopDongInListDto[]>({
      method: 'GET',
      url: '/api/app/loai-hop-dongs/all',
    },
    { apiName: this.apiName,...config });
  

  getListFilter = (input: BaseListFilterDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<LoaiHopDongInListDto>>({
      method: 'GET',
      url: '/api/app/loai-hop-dongs/filter',
      params: { keyword: input.keyword, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: CreateUpdateLoaiHopDongDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, LoaiHopDongDto>({
      method: 'PUT',
      url: `/api/app/loai-hop-dongs/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
