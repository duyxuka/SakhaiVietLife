import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto, PagedResultRequestDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { CheDoNhanVienDto, CheDoNhanVienInListDto, CheDoNhanVienListFilterDto, CreateUpdateCheDoNhanVienDto } from '../che-dos/che-do-nhan-viens/models';

@Injectable({
  providedIn: 'root',
})
export class CheDoNhanViensService {
  apiName = 'Default';
  

  create = (input: CreateUpdateCheDoNhanVienDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, CheDoNhanVienDto>({
      method: 'POST',
      url: '/api/app/che-do-nhan-viens',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/che-do-nhan-viens/${id}`,
    },
    { apiName: this.apiName,...config });
  

  deleteMultiple = (ids: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: '/api/app/che-do-nhan-viens/multiple',
      params: { ids },
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, CheDoNhanVienDto>({
      method: 'GET',
      url: `/api/app/che-do-nhan-viens/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getList = (input: PagedResultRequestDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<CheDoNhanVienDto>>({
      method: 'GET',
      url: '/api/app/che-do-nhan-viens',
      params: { skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  getListAll = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, CheDoNhanVienInListDto[]>({
      method: 'GET',
      url: '/api/app/che-do-nhan-viens/all',
    },
    { apiName: this.apiName,...config });
  

  getListFilter = (input: CheDoNhanVienListFilterDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<CheDoNhanVienInListDto>>({
      method: 'GET',
      url: '/api/app/che-do-nhan-viens/filter',
      params: { nhanVienId: input.nhanVienId, keyword: input.keyword, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: CreateUpdateCheDoNhanVienDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, CheDoNhanVienDto>({
      method: 'PUT',
      url: `/api/app/che-do-nhan-viens/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
