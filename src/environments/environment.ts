import { Environment } from '@abp/ng.core';

const baseUrl = 'http://localhost:4200';

const oAuthConfig = {
  issuer: 'https://localhost:44372/',
  redirectUri: baseUrl,
  clientId: 'VietLife_Admin',
  dummyClientSecret:'1q2w3e*',
  responseType: 'code',
  scope: 'offline_access VietLife.Admin',
  requireHttps: true,
  useRefreshToken: true,
};

export const environment = {
  production: false,
  application: {
    baseUrl,
    name: 'VietLife',
  },
  oAuthConfig,
  apis: {
    default: {
      url: 'https://localhost:44372',
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
