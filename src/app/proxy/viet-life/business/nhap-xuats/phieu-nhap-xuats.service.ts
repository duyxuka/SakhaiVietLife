import type { CreateUpdatePhieuNhapXuatDto, PhieuNhapXuatDto, PhieuNhapXuatInListDto } from './phieu-nhap-xuats/models';
import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto, PagedResultRequestDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { BaseListFilterDto } from '../../models';

@Injectable({
  providedIn: 'root',
})
export class PhieuNhapXuatsService {
  apiName = 'Default';
  

  create = (input: CreateUpdatePhieuNhapXuatDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PhieuNhapXuatDto>({
      method: 'POST',
      url: '/api/app/phieu-nhap-xuats',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/phieu-nhap-xuats/${id}`,
    },
    { apiName: this.apiName,...config });
  

  deleteMultiple = (ids: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: '/api/app/phieu-nhap-xuats/multiple',
      params: { ids },
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PhieuNhapXuatDto>({
      method: 'GET',
      url: `/api/app/phieu-nhap-xuats/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getList = (input: PagedResultRequestDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<PhieuNhapXuatDto>>({
      method: 'GET',
      url: '/api/app/phieu-nhap-xuats',
      params: { skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  getListAll = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, PhieuNhapXuatInListDto[]>({
      method: 'GET',
      url: '/api/app/phieu-nhap-xuats/all',
    },
    { apiName: this.apiName,...config });
  

  getListFilter = (input: BaseListFilterDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<PhieuNhapXuatInListDto>>({
      method: 'GET',
      url: '/api/app/phieu-nhap-xuats/filter',
      params: { keyword: input.keyword, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: CreateUpdatePhieuNhapXuatDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PhieuNhapXuatDto>({
      method: 'PUT',
      url: `/api/app/phieu-nhap-xuats/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
