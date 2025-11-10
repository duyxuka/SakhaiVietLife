import type { CreateUpdatePhuCapNhanVienDto, PhuCapNhanVienDto, PhuCapNhanVienFilterListDto, PhuCapNhanVienInListDto } from './models';
import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto, PagedResultRequestDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PhuCapNhanViensService {
  apiName = 'Default';
  

  create = (input: CreateUpdatePhuCapNhanVienDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PhuCapNhanVienDto>({
      method: 'POST',
      url: '/api/app/phu-cap-nhan-viens',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/phu-cap-nhan-viens/${id}`,
    },
    { apiName: this.apiName,...config });
  

  deleteMultiple = (ids: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: '/api/app/phu-cap-nhan-viens/multiple',
      params: { ids },
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PhuCapNhanVienDto>({
      method: 'GET',
      url: `/api/app/phu-cap-nhan-viens/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getList = (input: PagedResultRequestDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<PhuCapNhanVienDto>>({
      method: 'GET',
      url: '/api/app/phu-cap-nhan-viens',
      params: { skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  getListAll = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, PhuCapNhanVienInListDto[]>({
      method: 'GET',
      url: '/api/app/phu-cap-nhan-viens/all',
    },
    { apiName: this.apiName,...config });
  

  getListFilter = (input: PhuCapNhanVienFilterListDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<PhuCapNhanVienInListDto>>({
      method: 'GET',
      url: '/api/app/phu-cap-nhan-viens/filter',
      params: { chucVuId: input.chucVuId, keyword: input.keyword, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: CreateUpdatePhuCapNhanVienDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PhuCapNhanVienDto>({
      method: 'PUT',
      url: `/api/app/phu-cap-nhan-viens/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
