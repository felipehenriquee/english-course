import { createApp } from 'vue'

import App from './App.vue'
import { pinia } from '@/plugins/pinia'
import { vuetify } from '@/plugins/vuetify'
import { router } from '@/router'

import '@/assets/styles/main.css'
import '@mdi/font/css/materialdesignicons.css'

const app = createApp(App)

app.use(pinia)
app.use(vuetify)
app.use(router)

app.mount('#app')
