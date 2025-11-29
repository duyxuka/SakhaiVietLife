import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto, PagedResultRequestDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { ChiTietBaoGiaDto, CreateUpdateChiTietBaoGiaDto } from '../bao-gias-list/chi-tiet-bao-gias/models';

@Injectable({
  providedIn: 'root',
})
export class ChiTietBaoGiasService {
  apiName = 'Default';
  

  create = (input: CreateUpdateChiTietBaoGiaDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ChiTietBaoGiaDto>({
      method: 'POST',
      url: '/api/app/chi-tiet-bao-gias',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/chi-tiet-bao-gias/${id}`,
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ChiTietBaoGiaDto>({
      method: 'GET',
      url: `/api/app/chi-tiet-bao-gias/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getByBaoGiaId = (baoGiaId: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ChiTietBaoGiaDto[]>({
      method: 'GET',
      url: `/api/app/chi-tiet-bao-gias/by-bao-gia-id/${baoGiaId}`,
    },
    { apiName: this.apiName,...config });
  

  getList = (input: PagedResultRequestDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<ChiTietBaoGiaDto>>({
      method: 'GET',
      url: '/api/app/chi-tiet-bao-gias',
      params: { skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: CreateUpdateChiTietBaoGiaDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ChiTietBaoGiaDto>({
      method: 'PUT',
      url: `/api/app/chi-tiet-bao-gias/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
