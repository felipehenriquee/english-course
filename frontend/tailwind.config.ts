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
