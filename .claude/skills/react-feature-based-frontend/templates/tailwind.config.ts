import type { Config } from 'tailwindcss'

/**
 * Configuração personalizada do Tailwind.
 *
 * IMPORTANTE (MUI + Tailwind convivem no mesmo projeto):
 * - O `<CssBaseline />` do MUI já normaliza margens/tipografia (parecido com
 *   um reset). O preflight do Tailwind reseta as mesmas propriedades, o que
 *   pode conflitar com o espaçamento dos componentes MUI. Por isso
 *   `corePlugins.preflight` fica desativado abaixo — mesma decisão tomada
 *   nas versões Vue+Vuetify e Angular+Material desta skill.
 * - Use Tailwind para layout/espaçamento/utilitário rápido (`flex`, `gap-4`,
 *   `text-sm`, `px-6`...) e MUI para os componentes de UI prontos (Button,
 *   Card, TextField, Dialog...).
 */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
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
