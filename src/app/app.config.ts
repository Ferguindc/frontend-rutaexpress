import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import {
  MSAL_GUARD_CONFIG,
  MSAL_INSTANCE,
  MSAL_INTERCEPTOR_CONFIG,
  MsalBroadcastService,
  MsalGuard,
  MsalInterceptor,
  MsalInterceptorConfiguration,
  MsalService,
} from '@azure/msal-angular';

import { InteractionType } from '@azure/msal-browser';

import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

import { routes } from './app.routes';
import { MSALInstanceFactory } from './factories/msal-instance.factory';
import { environment } from '../environments/environment';

const msalInterceptorConfig: MsalInterceptorConfiguration = {
  interactionType: InteractionType.Redirect,

 protectedResourceMap: new Map([
    // Le agregamos '/*' para que intercepte cualquier subruta que empiece por /desarrollo/
    [`${environment.azure.api.url}/*`, [environment.azure.api.scope]],
  ]),
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),

    provideRouter(routes),

    provideHttpClient(withInterceptorsFromDi()),

    {
      provide: MSAL_INSTANCE,
      useFactory: MSALInstanceFactory,
    },

    {
      provide: MSAL_GUARD_CONFIG,
      useValue: {
        interactionType: InteractionType.Redirect,
        authRequest: {
          // CORRECCIÓN: Se añade el scope de la API personalizada para solicitar el token correcto desde el inicio
          scopes: ['openid', 'profile', environment.azure.api.scope],
        },
      },
    },

    {
      provide: MSAL_INTERCEPTOR_CONFIG,
      useValue: msalInterceptorConfig,
    },

    {
      provide: HTTP_INTERCEPTORS,
      useClass: MsalInterceptor,
      multi: true,
    },

    MsalService,
    MsalGuard,
    MsalBroadcastService,
  ],
};