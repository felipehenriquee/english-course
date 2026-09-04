import type { Config } from 'tailwindcss'

/**
 * Configuração personalizada do Tailwind.
 *
 * IMPORTANTE (Angular Material + Tailwind convivem no mesmo projeto):
 * - O Angular Material define sua própria tipografia base (`.mat-typography`,
 *   margens de h1-h6, parágrafos etc). O preflight do Tailwind reseta essas
 *   mesmas propriedades, o que pode quebrar o espaçamento dos componentes
 *   Material. Por isso `corePlugins.preflight` fica desativado abaixo — igual
 *   à mesma decisão tomada na versão Vue+Vuetify desta skill.
 * - Use Tailwind para layout/espaçamento/utilitário rápido (`flex`, `gap-4`,
 *   `text-sm`, `px-6`...) e Angular Material para os componentes de UI
 *   prontos (mat-button, mat-card, mat-form-field, mat-dialog...).
 */
export default {
  content: ['./src/**/*.{html,ts}'],
  darkMode: 'class',
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef4ff',
          100: '#d9e6ff',
          200: '#b3ccff',
          300: '#80a8ff',
          400: '#4d7dff',
          500: '#1a52ff',
          600: '#0f3fd9',
          700: '#0c31a8',
          800: '#0a2680',
          900: '#081c5c',
        },
        'sp-primary': {
          DEFAULT: '#dbf24e', // antigo --accent
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
        },
        'sp-secondary': {
          DEFAULT: '#345efc', // antigo --primary
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
        },
        'sp-danger': {
          DEFAULT: '#ea3b48', // antigo --destructive
          50: '#fef5f6',
          100: '#fdebed',
          200: '#faced1',
          300: '#f7b1b6',
          400: '#f0767f',
          500: '#ea3b48',
          600: '#c7323d',
          700: '#a42932',
          800: '#812028',
          900: '#521519',
        },
        'sp-warning': {
          DEFAULT: '#f59e0b',
          50: '#fefaf3',
          100: '#fef5e7',
          200: '#fce7c2',
          300: '#fbd89d',
          400: '#f8bb54',
          500: '#f59e0b',
          600: '#d08609',
          700: '#ac6f08',
          800: '#875706',
          900: '#563704',
        },
        'sp-info': {
          DEFAULT: '#0ea5e9',
          50: '#f3fafe',
          100: '#e7f6fd',
          200: '#c3e8fa',
          300: '#9fdbf6',
          400: '#56c0f0',
          500: '#0ea5e9',
          600: '#0c8cc6',
          700: '#0a73a3',
          800: '#085b80',
          900: '#053a52',
        },
        'sp-success': {
          DEFAULT: '#22c55e',
          50: '#f4fcf7',
          100: '#e9f9ef',
          200: '#c8f0d7',
          300: '#a7e8bf',
          400: '#64d68e',
          500: '#22c55e',
          600: '#1da750',
          700: '#188a42',
          800: '#136c34',
          900: '#0c4521',
        },
        'sp-neutral': {
          DEFAULT: '#94a2ba', // antigo --muted-foreground / steel
          50: '#fafafc',
          100: '#f4f6f8',
          200: '#e4e8ee',
          300: '#d4dae3',
          400: '#b4becf',
          500: '#94a2ba',
          600: '#7e8a9e',
          700: '#687182',
          800: '#515966',
          900: '#343941',
        },
      },
      fontFamily: {
        sans: ['"Roboto"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      spacing: {
        18: '4.5rem',
        22: '5.5rem',
      },
      borderRadius: {
        xl2: '1rem',
      },
      boxShadow: {
        card: '0 2px 8px 0 rgba(0, 0, 0, 0.08)',
      },
      screens: {
        xs: '480px',
      },
    },
  },
  plugins: [],
} satisfies Config
