import { signal } from '@angular/core'

/** Modos de tema suportados. */
export type ThemeMode = 'dark' | 'light'

/** Tema padrão / fallback — é o único look que a aplicação tinha até agora. */
export const DEFAULT_THEME: ThemeMode = 'dark'

/** Chave usada para persistir a escolha de tema no localStorage. */
export const THEME_STORAGE_KEY = 'theme'

export function isThemeMode(value: string | null | undefined): value is ThemeMode {
  return value === 'dark' || value === 'light'
}

/**
 * Tema a usar no primeiro carregamento: escolha salva > padrão. Sem
 * `prefers-color-scheme` de propósito — dark é a identidade visual da
 * aplicação, não algo que deva mudar sozinho com o SO.
 */
export function resolveInitialTheme(): ThemeMode {
  const stored = localStorage.getItem(THEME_STORAGE_KEY)
  return isThemeMode(stored) ? stored : DEFAULT_THEME
}

/**
 * Signal compartilhado, fora de DI de propósito: `ThemeStore` (injetável,
 * usado pelos components) e `core/constants/colors.ts` (módulo plano, sem
 * acesso a injeção) precisam ler o mesmo estado — ver ThemeStore.
 */
export const themeMode = signal<ThemeMode>(resolveInitialTheme())
