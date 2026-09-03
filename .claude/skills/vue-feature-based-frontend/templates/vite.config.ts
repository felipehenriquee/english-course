import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vuetify from 'vite-plugin-vuetify'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    // Auto-import + tree-shaking dos componentes/estilos do Vuetify
    vuetify({ autoImport: true }),
  ],
  resolve: {
    alias: {
      // Import absoluto: import X from '@/features/users/...'
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 5173,
    // Proxy opcional para a API em desenvolvimento (evita CORS)
    // proxy: {
    //   '/api': {
    //     target: 'http://localhost:3000',
    //     changeOrigin: true,
    //   },
    // },
  },
  build: {
    sourcemap: false,
    outDir: 'dist',
  },
})
