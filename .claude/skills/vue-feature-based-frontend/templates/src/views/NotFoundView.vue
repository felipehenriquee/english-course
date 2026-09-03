<script setup lang="ts">
import { useRouter } from 'vue-router'
const router = useRouter()
</script>

<template>
  <div class="flex min-h-screen flex-col items-center justify-center gap-4 text-center">
    <p class="text-6xl font-bold text-slate-300">404</p>
    <p class="text-slate-600">Página não encontrada</p>
    <v-btn color="primary" variant="tonal" @click="router.push({ name: 'home' })">
      Voltar para o início
    </v-btn>
  </div>
</template>
