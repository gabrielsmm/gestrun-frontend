import { ApplicationConfig, importProvidersFrom, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { provideEnvironmentNgxMask } from 'ngx-mask';
import { provideToastr } from 'ngx-toastr';
import { NgxUiLoaderConfig, NgxUiLoaderModule } from 'ngx-ui-loader';
import { getPtBrPaginatorIntl } from './core/i18n/mat-paginator-intl-pt';

import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';

const ngxUiLoaderConfig: NgxUiLoaderConfig = {
  // your configuration here
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([authInterceptor])
    ),
    provideAnimations(),
    provideToastr(),
    provideEnvironmentNgxMask(),
    importProvidersFrom(
      NgxUiLoaderModule.forRoot(ngxUiLoaderConfig)
    ),
    { provide: MatPaginatorIntl, useFactory: getPtBrPaginatorIntl }
  ]
};
