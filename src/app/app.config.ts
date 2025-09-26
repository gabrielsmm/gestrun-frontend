import { ApplicationConfig, importProvidersFrom, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { provideEnvironmentNgxMask } from 'ngx-mask';
import { provideToastr } from 'ngx-toastr';
import { NgxUiLoaderConfig, NgxUiLoaderModule } from 'ngx-ui-loader';

import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';

const ngxUiLoaderConfig: NgxUiLoaderConfig = {
  // your configuration here
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    provideAnimations(),
    provideToastr(),
    provideEnvironmentNgxMask(),
    importProvidersFrom(
      NgxUiLoaderModule.forRoot(ngxUiLoaderConfig)
    )
  ]
};
