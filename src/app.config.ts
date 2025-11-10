import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideAbpOAuth } from '@abp/ng.oauth';
import { ApplicationConfig } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter, withEnabledBlockingInitialNavigation, withInMemoryScrolling } from '@angular/router';
import Aura from '@primeuix/themes/aura';
import { providePrimeNG } from 'primeng/config';
import { appRoutes } from './app.routes';
import { provideAbpCore, withOptions } from '@abp/ng.core';
import { environment } from './environments/environment.prod';
import { registerLocale } from '@abp/ng.core/locale';
import { registerLocaleData } from '@angular/common';
import localeVi from '@angular/common/locales/vi';
import { VI_LOCALE } from './app/shared/locales/vi.locale';
registerLocaleData(localeVi);
export const appConfig: ApplicationConfig = {
    providers: [
        provideAbpCore(
            withOptions({
                environment,
                registerLocaleFn: (locale: string) => {
                    if (locale === 'vi') {
                        return Promise.resolve(VI_LOCALE);
                    }
                    return Promise.resolve({});
                }
            }),
        ),
        provideAbpOAuth(),
        provideRouter(
            appRoutes,
            withInMemoryScrolling({ anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled' }),
            withEnabledBlockingInitialNavigation()
        ),
        provideHttpClient(withFetch()),
        provideAnimationsAsync(),
        providePrimeNG({ theme: { preset: Aura, options: { darkModeSelector: '.app-dark' } } }),

    ]
};
