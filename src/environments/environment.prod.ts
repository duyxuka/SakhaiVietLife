import { Environment } from '@abp/ng.core';

const baseUrl = 'https://vietlife.com.vn/admin';

const oAuthConfig = {
  issuer: 'https://vietlife.com.vn/',
  redirectUri: baseUrl,
  clientId: 'VietLife_Admin',
  dummyClientSecret:'1q2w3e*',
  responseType: 'code',
  scope: 'offline_access VietLife.Admin',
  requireHttps: true,
  useRefreshToken: true,
};

export const environment = {
  production: true,
  application: {
    baseUrl,
    name: 'VietLife',
  },
  oAuthConfig,
  apis: {
    default: {
      url: 'https://vietlife.com.vn',
      rootNamespace: 'VietLife.Admin',
    },
    AbpAccountPublic: {
      url: oAuthConfig.issuer,
      rootNamespace: 'AbpAccountPublic',
    },
  },
  localization: {
    defaultResourceName: 'VietLife',
    supportedLocales: ['en', 'vi'],
  },
} as Environment;
