/** Idiomas suportados pela aplicação. */
export const AVAILABLE_LANGS = ['pt-BR', 'en'] as const

export type AppLang = (typeof AVAILABLE_LANGS)[number]

/** Idioma padrão / fallback. */
export const DEFAULT_LANG: AppLang = 'pt-BR'

/** Chave usada para persistir a escolha de idioma no localStorage. */
export const LANG_STORAGE_KEY = 'lang'

/** Rótulos exibidos no seletor de idioma. */
export const LANG_LABELS: Record<AppLang, string> = {
  'pt-BR': 'Português (BR)',
  en: 'English',
}

export function isAppLang(value: string | null | undefined): value is AppLang {
  return !!value && (AVAILABLE_LANGS as readonly string[]).includes(value)
}
