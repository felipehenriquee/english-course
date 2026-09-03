import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core'
import { provideRouter, withComponentInputBinding } from '@angular/router'
import { provideHttpClient, withInterceptors } from '@angular/common/http'
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async'

import { routes } from '@app/app.routes'
import { authInterceptor } from '@app/core/interceptors/auth.interceptor'
import { errorInterceptor } from '@app/core/interceptors/error.interceptor'
import { provideI18n } from '@app/core/i18n/transloco.providers'

/**
 * Configuração raiz da aplicação (equivalente ao main.ts + plugins do Vue).
 * - provideHttpClient + interceptors funcionais: injeta token e trata erros
 *   globalmente, igual ao interceptor do Axios na versão Vue.
 * - provideRouter: rotas + guarda de autenticação (ver app.routes.ts).
 * - provideAnimationsAsync: necessário para os componentes do Angular Material.
 */
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withInterceptors([authInterceptor, errorInterceptor])),
    provideAnimationsAsync(),
    provideI18n(),
  ],
}
