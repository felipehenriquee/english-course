import { Injectable, inject, signal } from '@angular/core'
import { TranslocoService } from '@jsverse/transloco'

import {
  AVAILABLE_LANGS,
  AppLang,
  DEFAULT_LANG,
  LANG_LABELS,
  LANG_STORAGE_KEY,
  isAppLang,
} from '@app/core/i18n/i18n'

/**
 * Idioma a usar no primeiro carregamento: escolha salva > idioma do
 * navegador > padrão. Chamado no APP_INITIALIZER (ver transloco.providers.ts).
 */
export function resolveInitialLang(): AppLang {
  const stored = localStorage.getItem(LANG_STORAGE_KEY)
  if (isAppLang(stored)) return stored

  const browser = navigator.language
  if (isAppLang(browser)) return browser
  if (browser?.toLowerCase().startsWith('pt')) return 'pt-BR'
  if (browser?.toLowerCase().startsWith('en')) return 'en'

  return DEFAULT_LANG
}

/**
 * Store do idioma ativo (Signals). Encapsula o TranslocoService e persiste a
 * escolha no localStorage — mesmo padrão dos outros stores da aplicação.
 */
@Injectable({ providedIn: 'root' })
export class LanguageStore {
  private readonly transloco = inject(TranslocoService)

  private readonly _current = signal<AppLang>(this.transloco.getActiveLang() as AppLang)
  readonly current = this._current.asReadonly()

  readonly available = AVAILABLE_LANGS.map((code) => ({ code, label: LANG_LABELS[code] }))

  setLang(lang: AppLang): void {
    if (lang === this._current()) return
    this.transloco.setActiveLang(lang)
    localStorage.setItem(LANG_STORAGE_KEY, lang)
    this._current.set(lang)
  }
}
