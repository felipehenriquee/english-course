<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/features/auth/store/authStore'

const router = useRouter()
const authStore = useAuthStore()
const drawer = ref(true)

const navItems = [
  { title: 'Início', icon: 'mdi-view-dashboard-outline', to: { name: 'home' } },
  { title: 'Usuários', icon: 'mdi-account-multiple-outline', to: { name: 'users' } },
]

async function handleLogout() {
  await authStore.logout()
  router.push({ name: 'login' })
}
</script>

<template>
  <v-app-bar :elevation="1">
    <v-app-bar-nav-icon @click="drawer = !drawer" />
    <v-app-bar-title>{{ (import.meta.env.VITE_APP_NAME as string) ?? 'App' }}</v-app-bar-title>
    <v-spacer />
    <span v-if="authStore.user" class="mr-3 hidden text-sm text-slate-600 sm:inline">
      {{ authStore.user.name }}
    </span>
    <v-btn icon="mdi-logout" variant="text" title="Sair" @click="handleLogout" />
  </v-app-bar>

  <v-navigation-drawer v-model="drawer">
    <v-list nav density="compact">
      <v-list-item
        v-for="item in navItems"
        :key="item.title"
        :to="item.to"
        :prepend-icon="item.icon"
        :title="item.title"
      />
    </v-list>
  </v-navigation-drawer>

  <v-main class="bg-slate-50">
    <RouterView />
  </v-main>
</template>
