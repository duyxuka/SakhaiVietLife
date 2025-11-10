import type { CreateUpdateLuongNhanVienDto, LuongNhanVienDto, LuongNhanVienInListDto, LuongNhanVienListFilterDto } from './models';
import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto, PagedResultRequestDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LuongNhanViensService {
  apiName = 'Default';
  

  create = (input: CreateUpdateLuongNhanVienDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, LuongNhanVienDto>({
      method: 'POST',
      url: '/api/app/luong-nhan-viens',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/luong-nhan-viens/${id}`,
    },
    { apiName: this.apiName,...config });
  

  deleteMultiple = (ids: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: '/api/app/luong-nhan-viens/multiple',
      params: { ids },
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, LuongNhanVienDto>({
      method: 'GET',
      url: `/api/app/luong-nhan-viens/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getList = (input: PagedResultRequestDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<LuongNhanVienDto>>({
      method: 'GET',
      url: '/api/app/luong-nhan-viens',
      params: { skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  getListAll = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, LuongNhanVienInListDto[]>({
      method: 'GET',
      url: '/api/app/luong-nhan-viens/all',
    },
    { apiName: this.apiName,...config });
  

  getListFilter = (input: LuongNhanVienListFilterDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<LuongNhanVienInListDto>>({
      method: 'GET',
      url: '/api/app/luong-nhan-viens/filter',
      params: { nhanVienId: input.nhanVienId, thang: input.thang, nam: input.nam, keyword: input.keyword, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  tinhLuongHangNgay = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'POST',
      url: '/api/app/luong-nhan-viens/tinh-luong-hang-ngay',
    },
    { apiName: this.apiName,...config });
  

  tinhLuongThang = (thang: number, nam: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'POST',
      url: '/api/app/luong-nhan-viens/tinh-luong-thang',
      params: { thang, nam },
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: CreateUpdateLuongNhanVienDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, LuongNhanVienDto>({
      method: 'PUT',
      url: `/api/app/luong-nhan-viens/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
