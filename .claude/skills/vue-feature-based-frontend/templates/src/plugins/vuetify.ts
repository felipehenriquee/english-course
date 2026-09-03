import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi'

/**
 * Instância única do Vuetify.
 * Tema "brand" reaproveita as mesmas cores do tailwind.config.ts (brand.*)
 * para manter consistência visual entre componentes Vuetify e classes Tailwind.
 */
export const vuetify = createVuetify({
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: { mdi },
  },
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        dark: false,
        colors: {
          primary: '#1a52ff',
          secondary: '#0c31a8',
          error: '#dc2626',
          success: '#16a34a',
          warning: '#d97706',
          info: '#0284c7',
          background: '#f8fafc',
        },
      },
      dark: {
        dark: true,
        colors: {
          primary: '#4d7dff',
          secondary: '#80a8ff',
          error: '#f87171',
          success: '#4ade80',
          warning: '#fbbf24',
          info: '#38bdf8',
        },
      },
    },
  },
  defaults: {
    VBtn: { style: 'text-transform: none; letter-spacing: normal;' },
    VTextField: { variant: 'outlined', density: 'comfortable' },
    VCard: { rounded: 'lg' },
  },
})
