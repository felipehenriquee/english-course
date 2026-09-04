import { Injectable, effect } from '@angular/core'

import { THEME_STORAGE_KEY, ThemeMode, themeMode } from '@app/core/theme/theme'

/**
 * Store do tema ativo (Signals) — mesmo padrão do LanguageStore. O signal em
 * si vive em `theme.ts` (fora de DI) porque `colors.ts` também precisa lê-lo;
 * este store só expõe os métodos de mutação e sincroniza a classe `.dark` no
 * `<html>` (ver `main.ts` para a aplicação inicial, antes do bootstrap).
 */
@Injectable({ providedIn: 'root' })
export class ThemeStore {
  readonly mode = themeMode.asReadonly()

  constructor() {
    effect(() => {
      document.documentElement.classList.toggle('dark', themeMode() === 'dark')
    })
  }

  toggle(): void {
    this.setMode(themeMode() === 'dark' ? 'light' : 'dark')
  }

  setMode(mode: ThemeMode): void {
    if (mode === themeMode()) return
    themeMode.set(mode)
    localStorage.setItem(THEME_STORAGE_KEY, mode)
  }
}
