<script setup lang="ts">
// Root component: só orquestra o roteador.
// Cada layout (AuthLayout / DefaultLayout) é escolhido pela própria rota
// via <RouterView>, então nada de AppBar/Drawer fica fixo aqui.
</script>

<template>
  <v-app>
    <RouterView />
  </v-app>
</template>
