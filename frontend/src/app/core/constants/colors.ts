import { themeMode } from '@app/core/theme/theme'

/**
 * Espelha as escalas `sp-*` definidas em `tailwind.config.ts`.
 * Mantenha os dois arquivos sincronizados quando uma cor mudar.
 *
 * `primary*` e as chaves `ink*` são getters reativos (leem `themeMode`) —
 * no tema claro, "primary" vira a escala `secondary`, e os tons de texto
 * "ink*" invertem (ver `ThemeStore`). O resto do objeto é estático: cores
 * como danger/warning/info/success e os `neutral*` numerados não mudam com
 * o tema — quem precisa de um tom de texto reativo usa `ink`/`inkMuted`/
 * `inkOnAccent`, não `neutral50`/`neutral900` direto.
 */
const primaryScale = {
  DEFAULT: '#dbf24e',
  50: '#fdfef6',
  100: '#fbfeed',
  200: '#f6fcd3',
  300: '#f1fab8',
  400: '#e6f683',
  500: '#dbf24e',
  600: '#bace42',
  700: '#99a937',
  800: '#78852b',
  900: '#4d551b',
}

const secondaryScale = {
  DEFAULT: '#345efc',
  50: '#f5f7ff',
  100: '#ebefff',
  200: '#ccd7fe',
  300: '#aebffe',
  400: '#718efd',
  500: '#345efc',
  600: '#2c50d6',
  700: '#2442b0',
  800: '#1d348b',
  900: '#122158',
}

/** No tema claro, "primary" é substituído pela escala secondary. */
function accent(shade: keyof typeof primaryScale): string {
  return themeMode() === 'dark' ? primaryScale[shade] : secondaryScale[shade]
}

export const color = {
  get primary() {
    return accent('DEFAULT')
  },
  get primary50() {
    return accent(50)
  },
  get primary100() {
    return accent(100)
  },
  get primary200() {
    return accent(200)
  },
  get primary300() {
    return accent(300)
  },
  get primary400() {
    return accent(400)
  },
  get primary500() {
    return accent(500)
  },
  get primary600() {
    return accent(600)
  },
  get primary700() {
    return accent(700)
  },
  get primary800() {
    return accent(800)
  },
  get primary900() {
    return accent(900)
  },

  /** Texto/ícone sobre o fundo da página ou de um card `.glass`. */
  get ink(): string {
    return themeMode() === 'dark' ? '#fafafc' : '#343941'
  },
  /** Igual `ink`, só que pra texto secundário/rótulo (menos contraste). */
  get inkMuted(): string {
    return themeMode() === 'dark' ? '#d4dae3' : '#687182'
  },
  /** Texto/ícone sobre um fundo `color.primary` (inverso de `ink`, já que o
   * próprio accent troca de claro pra escuro entre os temas). */
  get inkOnAccent(): string {
    return themeMode() === 'dark' ? '#343941' : '#fafafc'
  },

  secondary: '#345efc',
  secondary50: '#f5f7ff',
  secondary100: '#ebefff',
  secondary200: '#ccd7fe',
  secondary300: '#aebffe',
  secondary400: '#718efd',
  secondary500: '#345efc',
  secondary600: '#2c50d6',
  secondary700: '#2442b0',
  secondary800: '#1d348b',
  secondary900: '#122158',

  danger: '#ea3b48',
  danger50: '#fef5f6',
  danger100: '#fdebed',
  danger200: '#faced1',
  danger300: '#f7b1b6',
  danger400: '#f0767f',
  danger500: '#ea3b48',
  danger600: '#c7323d',
  danger700: '#a42932',
  danger800: '#812028',
  danger900: '#521519',

  warning: '#f59e0b',
  warning50: '#fefaf3',
  warning100: '#fef5e7',
  warning200: '#fce7c2',
  warning300: '#fbd89d',
  warning400: '#f8bb54',
  warning500: '#f59e0b',
  warning600: '#d08609',
  warning700: '#ac6f08',
  warning800: '#875706',
  warning900: '#563704',

  info: '#0ea5e9',
  info50: '#f3fafe',
  info100: '#e7f6fd',
  info200: '#c3e8fa',
  info300: '#9fdbf6',
  info400: '#56c0f0',
  info500: '#0ea5e9',
  info600: '#0c8cc6',
  info700: '#0a73a3',
  info800: '#085b80',
  info900: '#053a52',

  success: '#22c55e',
  success50: '#f4fcf7',
  success100: '#e9f9ef',
  success200: '#c8f0d7',
  success300: '#a7e8bf',
  success400: '#64d68e',
  success500: '#22c55e',
  success600: '#1da750',
  success700: '#188a42',
  success800: '#136c34',
  success900: '#0c4521',

  neutral: '#94a2ba',
  neutral50: '#fafafc',
  neutral100: '#f4f6f8',
  neutral200: '#e4e8ee',
  neutral300: '#d4dae3',
  neutral400: '#b4becf',
  neutral500: '#94a2ba',
  neutral600: '#7e8a9e',
  neutral700: '#687182',
  neutral800: '#515966',
  neutral900: '#343941',
} as const
