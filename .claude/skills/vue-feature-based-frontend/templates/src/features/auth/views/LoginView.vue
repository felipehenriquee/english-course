<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/features/auth/store/authStore'

const router = useRouter()
const authStore = useAuthStore()

const form = ref({ email: '', password: '' })
const showPassword = ref(false)
const formRef = ref()

const rules = {
  required: (v: string) => !!v || 'Campo obrigatório',
  email: (v: string) => /.+@.+\..+/.test(v) || 'E-mail inválido',
}

async function handleSubmit() {
  const { valid } = await formRef.value.validate()
  if (!valid) return

  try {
    await authStore.login(form.value)
    router.push({ name: 'home' })
  } catch {
    // authStore.error já guarda a mensagem; exibida no v-alert abaixo.
  }
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-slate-50 px-4">
    <v-card class="w-full max-w-sm" elevation="4">
      <v-card-item class="pt-8 text-center">
        <v-card-title class="text-2xl font-semibold">Bem-vindo de volta</v-card-title>
        <v-card-subtitle class="mt-1">Entre com sua conta para continuar</v-card-subtitle>
      </v-card-item>

      <v-card-text class="pt-4">
        <v-alert
          v-if="authStore.error"
          type="error"
          variant="tonal"
          density="compact"
          class="mb-4"
        >
          {{ authStore.error }}
        </v-alert>

        <v-form ref="formRef" @submit.prevent="handleSubmit">
          <v-text-field
            v-model="form.email"
            label="E-mail"
            type="email"
            prepend-inner-icon="mdi-email-outline"
            :rules="[rules.required, rules.email]"
            class="mb-2"
          />

          <v-text-field
            v-model="form.password"
            label="Senha"
            :type="showPassword ? 'text' : 'password'"
            prepend-inner-icon="mdi-lock-outline"
            :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
            :rules="[rules.required]"
            class="mb-2"
            @click:append-inner="showPassword = !showPassword"
          />

          <v-btn
            type="submit"
            color="primary"
            block
            size="large"
            class="mt-2"
            :loading="authStore.loading"
          >
            Entrar
          </v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </div>
</template>
