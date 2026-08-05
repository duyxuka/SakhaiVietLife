import type { EntityDto } from '@abp/ng.core';

export interface CreateUpdateSeoConfigDto {
  pageKey?: string;
  seoTitle?: string;
  seoKeywords?: string;
  seoDescription?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImageUrl?: string;
  canonicalUrl?: string;
  robots?: string;
}

export interface SeoConfigDto {
  id?: string;
  pageKey?: string;
  seoTitle?: string;
  seoKeywords?: string;
  seoDescription?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImageUrl?: string;
  canonicalUrl?: string;
  robots?: string;
}

export interface SeoConfigInListDto extends EntityDto<string> {
  pageKey?: string;
  seoTitle?: string;
  seoDescription?: string;
  robots?: string;
  creationTime?: string;
}
