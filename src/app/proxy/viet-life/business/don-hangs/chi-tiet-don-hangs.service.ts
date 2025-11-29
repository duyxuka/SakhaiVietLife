import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto, PagedResultRequestDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { ChiTietDonHangDto, CreateUpdateChiTietDonHangDto } from '../don-hangs-list/chi-tiet-don-hangs/models';

@Injectable({
  providedIn: 'root',
})
export class ChiTietDonHangsService {
  apiName = 'Default';
  

  create = (input: CreateUpdateChiTietDonHangDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ChiTietDonHangDto>({
      method: 'POST',
      url: '/api/app/chi-tiet-don-hangs',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/chi-tiet-don-hangs/${id}`,
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ChiTietDonHangDto>({
      method: 'GET',
      url: `/api/app/chi-tiet-don-hangs/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getByDonHangId = (donHangId: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ChiTietDonHangDto[]>({
      method: 'GET',
      url: `/api/app/chi-tiet-don-hangs/by-don-hang-id/${donHangId}`,
    },
    { apiName: this.apiName,...config });
  

  getList = (input: PagedResultRequestDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<ChiTietDonHangDto>>({
      method: 'GET',
      url: '/api/app/chi-tiet-don-hangs',
      params: { skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: CreateUpdateChiTietDonHangDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ChiTietDonHangDto>({
      method: 'PUT',
      url: `/api/app/chi-tiet-don-hangs/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
