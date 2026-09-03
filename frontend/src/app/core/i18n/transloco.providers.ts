import {
  EnvironmentProviders,
  inject,
  makeEnvironmentProviders,
  provideAppInitializer,
} from '@angular/core'
import { firstValueFrom } from 'rxjs'
import { provideTransloco, TranslocoService } from '@jsverse/transloco'

import { environment } from '@env/environment'
import { AVAILABLE_LANGS, DEFAULT_LANG } from '@app/core/i18n/i18n'
import { TranslocoHttpLoader } from '@app/core/i18n/transloco-loader'
import { resolveInitialLang } from '@app/core/i18n/language.store'

/**
 * Providers do i18n (Transloco). Adicionado em app.config.ts.
 *
 * - runtime, sem rebuild por idioma (`reRenderOnLangChange`);
 * - o APP_INITIALIZER resolve o idioma inicial (localStorage > navegador >
 *   padrão) e pré-carrega o JSON antes de renderizar a aplicação, evitando
 *   flash de chaves cruas.
 */
export function provideI18n(): EnvironmentProviders {
  return makeEnvironmentProviders([
    provideTransloco({
      config: {
        availableLangs: [...AVAILABLE_LANGS],
        defaultLang: DEFAULT_LANG,
        fallbackLang: DEFAULT_LANG,
        reRenderOnLangChange: true,
        prodMode: environment.production,
        missingHandler: { logMissingKey: !environment.production },
      },
      loader: TranslocoHttpLoader,
    }),
    provideAppInitializer(async () => {
      const transloco = inject(TranslocoService)
      const lang = resolveInitialLang()
      transloco.setActiveLang(lang)
      await firstValueFrom(transloco.load(lang))
    }),
  ])
}
