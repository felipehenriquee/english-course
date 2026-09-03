<script setup lang="ts">
import { ref, watch } from 'vue'
import type { User } from '@/features/users/types/user'

const props = defineProps<{
  modelValue: boolean
  editingUser?: User | null
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  submit: [payload: Omit<User, 'id'>]
}>()

const form = ref({ name: '', email: '', role: 'viewer' as User['role'], active: true })
const formRef = ref()

watch(
  () => props.editingUser,
  (user) => {
    form.value = user
      ? { name: user.name, email: user.email, role: user.role, active: user.active }
      : { name: '', email: '', role: 'viewer', active: true }
  },
  { immediate: true },
)

async function handleSubmit() {
  const { valid } = await formRef.value.validate()
  if (!valid) return
  emit('submit', { ...form.value })
}
</script>

<template>
  <v-dialog
    :model-value="modelValue"
    max-width="480"
    @update:model-value="(v) => emit('update:modelValue', v)"
  >
    <v-card>
      <v-card-title>{{ editingUser ? 'Editar usuário' : 'Novo usuário' }}</v-card-title>
      <v-card-text>
        <v-form ref="formRef" @submit.prevent="handleSubmit">
          <v-text-field
            v-model="form.name"
            label="Nome"
            :rules="[(v: string) => !!v || 'Obrigatório']"
            class="mb-2"
          />
          <v-text-field
            v-model="form.email"
            label="E-mail"
            type="email"
            :rules="[(v: string) => !!v || 'Obrigatório']"
            class="mb-2"
          />
          <v-select
            v-model="form.role"
            label="Papel"
            :items="['admin', 'editor', 'viewer']"
            class="mb-2"
          />
          <v-switch v-model="form.active" label="Ativo" color="primary" />
        </v-form>
      </v-card-text>
      <v-card-actions class="justify-end px-4 pb-4">
        <v-btn variant="text" @click="emit('update:modelValue', false)">Cancelar</v-btn>
        <v-btn color="primary" @click="handleSubmit">Salvar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
