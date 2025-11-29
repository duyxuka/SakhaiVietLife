import type { ChiTietPhieuNhapXuatDto, CreateUpdateChiTietPhieuNhapXuatDto } from './chi-tiet-phieu-nhap-xuats/models';
import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto, PagedResultRequestDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ChiTietPhieuNhapXuatsService {
  apiName = 'Default';
  

  create = (input: CreateUpdateChiTietPhieuNhapXuatDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ChiTietPhieuNhapXuatDto>({
      method: 'POST',
      url: '/api/app/chi-tiet-phieu-nhap-xuats',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/chi-tiet-phieu-nhap-xuats/${id}`,
    },
    { apiName: this.apiName,...config });
  

  deleteMultiple = (ids: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: '/api/app/chi-tiet-phieu-nhap-xuats/multiple',
      params: { ids },
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ChiTietPhieuNhapXuatDto>({
      method: 'GET',
      url: `/api/app/chi-tiet-phieu-nhap-xuats/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getList = (input: PagedResultRequestDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<ChiTietPhieuNhapXuatDto>>({
      method: 'GET',
      url: '/api/app/chi-tiet-phieu-nhap-xuats',
      params: { skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  getListByPhieuId = (phieuId: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ChiTietPhieuNhapXuatDto[]>({
      method: 'GET',
      url: `/api/app/chi-tiet-phieu-nhap-xuats/by-phieu-id/${phieuId}`,
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: CreateUpdateChiTietPhieuNhapXuatDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ChiTietPhieuNhapXuatDto>({
      method: 'PUT',
      url: `/api/app/chi-tiet-phieu-nhap-xuats/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
