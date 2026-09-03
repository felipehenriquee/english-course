<script setup lang="ts">
import { useAuthStore } from '@/features/auth/store/authStore'

const authStore = useAuthStore()
</script>

<template>
  <div class="p-4 md:p-6">
    <h1 class="text-xl font-semibold">
      Olá{{ authStore.user?.name ? `, ${authStore.user.name}` : '' }} 👋
    </h1>
    <p class="mt-1 text-slate-600">Esta é a página principal, protegida por autenticação.</p>

    <div class="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <v-card class="p-4" elevation="1">
        <p class="text-sm text-slate-500">Exemplo de card</p>
        <p class="text-2xl font-semibold">42</p>
      </v-card>
    </div>
  </div>
</template>
