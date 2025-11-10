import type { ChamCongDto, ChamCongInListDto, ChamCongListFilterDto, CreateUpdateChamCongDto } from './models';
import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto, PagedResultRequestDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ChamCongsService {
  apiName = 'Default';
  

  checkIn = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, string>({
      method: 'POST',
      responseType: 'text',
      url: '/api/app/cham-congs/check-in',
    },
    { apiName: this.apiName,...config });
  

  checkOut = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'POST',
      url: '/api/app/cham-congs/check-out',
    },
    { apiName: this.apiName,...config });
  

  create = (input: CreateUpdateChamCongDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ChamCongDto>({
      method: 'POST',
      url: '/api/app/cham-congs',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/cham-congs/${id}`,
    },
    { apiName: this.apiName,...config });
  

  deleteMultiple = (ids: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: '/api/app/cham-congs/multiple',
      params: { ids },
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ChamCongDto>({
      method: 'GET',
      url: `/api/app/cham-congs/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getList = (input: PagedResultRequestDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<ChamCongDto>>({
      method: 'GET',
      url: '/api/app/cham-congs',
      params: { skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  getListAll = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, ChamCongInListDto[]>({
      method: 'GET',
      url: '/api/app/cham-congs/all',
    },
    { apiName: this.apiName,...config });
  

  getListFilter = (input: ChamCongListFilterDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<ChamCongInListDto>>({
      method: 'GET',
      url: '/api/app/cham-congs/filter',
      params: { nhanVienId: input.nhanVienId, keyword: input.keyword, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: CreateUpdateChamCongDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ChamCongDto>({
      method: 'PUT',
      url: `/api/app/cham-congs/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
