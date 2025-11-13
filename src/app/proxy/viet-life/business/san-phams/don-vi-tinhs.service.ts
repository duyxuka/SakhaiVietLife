import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto, PagedResultRequestDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { BaseListFilterDto } from '../../models';
import type { CreateUpdateDonViTinhDto, DonViTinhDto, DonViTinhInListDto } from '../san-phams-list/don-vi-tinhs/models';

@Injectable({
  providedIn: 'root',
})
export class DonViTinhsService {
  apiName = 'Default';
  

  create = (input: CreateUpdateDonViTinhDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, DonViTinhDto>({
      method: 'POST',
      url: '/api/app/don-vi-tinhs',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/don-vi-tinhs/${id}`,
    },
    { apiName: this.apiName,...config });
  

  deleteMultiple = (ids: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: '/api/app/don-vi-tinhs/multiple',
      params: { ids },
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, DonViTinhDto>({
      method: 'GET',
      url: `/api/app/don-vi-tinhs/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getList = (input: PagedResultRequestDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<DonViTinhDto>>({
      method: 'GET',
      url: '/api/app/don-vi-tinhs',
      params: { skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  getListAll = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, DonViTinhInListDto[]>({
      method: 'GET',
      url: '/api/app/don-vi-tinhs/all',
    },
    { apiName: this.apiName,...config });
  

  getListFilter = (input: BaseListFilterDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<DonViTinhInListDto>>({
      method: 'GET',
      url: '/api/app/don-vi-tinhs/filter',
      params: { keyword: input.keyword, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: CreateUpdateDonViTinhDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, DonViTinhDto>({
      method: 'PUT',
      url: `/api/app/don-vi-tinhs/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
