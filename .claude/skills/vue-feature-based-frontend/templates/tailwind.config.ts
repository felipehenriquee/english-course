import type { Config } from 'tailwindcss'

/**
 * Configuração personalizada do Tailwind.
 *
 * IMPORTANTE (Vuetify + Tailwind convivem no mesmo projeto):
 * - O Vuetify já injeta seu próprio "preflight"/reset e classes utilitárias
 *   (ex: `elevation-2`, `d-flex`). Para evitar conflito de reset de CSS,
 *   o `preflight` do Tailwind é desativado abaixo (corePlugins.preflight = false).
 * - Use Tailwind para layout/espaçamento/tipografia utilitária rápida
 *   (`flex`, `gap-4`, `text-sm`, `px-6`...) e Vuetify para os componentes
 *   de UI prontos (botões, cards, inputs, dialogs...).
 * - Se preferir o reset do Tailwind, remova a linha `preflight: false`
 *   e ajuste os estilos base do Vuetify manualmente.
 */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
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
