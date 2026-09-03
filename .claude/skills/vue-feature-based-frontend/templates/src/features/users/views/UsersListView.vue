<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useUserStore } from '@/features/users/store/userStore'
import UserFormDialog from '@/features/users/components/UserFormDialog.vue'
import type { User } from '@/features/users/types/user'

const userStore = useUserStore()

const dialogOpen = ref(false)
const editingUser = ref<User | null>(null)

const headers = [
  { title: 'Nome', key: 'name' },
  { title: 'E-mail', key: 'email' },
  { title: 'Papel', key: 'role' },
  { title: 'Status', key: 'active' },
  { title: '', key: 'actions', sortable: false, align: 'end' as const },
]

onMounted(() => userStore.fetchAll())

function openCreate() {
  editingUser.value = null
  dialogOpen.value = true
}

function openEdit(user: User) {
  editingUser.value = user
  dialogOpen.value = true
}

async function handleSubmit(payload: Omit<User, 'id'>) {
  if (editingUser.value) {
    await userStore.update(editingUser.value.id, payload)
  } else {
    await userStore.create(payload)
  }
  dialogOpen.value = false
}

async function handleDelete(user: User) {
  if (confirm(`Remover ${user.name}?`)) {
    await userStore.remove(user.id)
  }
}
</script>

<template>
  <div class="p-4 md:p-6">
    <div class="mb-4 flex items-center justify-between">
      <h1 class="text-xl font-semibold">Usuários</h1>
      <v-btn color="primary" prepend-icon="mdi-plus" @click="openCreate">Novo usuário</v-btn>
    </div>

    <v-alert v-if="userStore.error" type="error" variant="tonal" class="mb-4">
      {{ userStore.error }}
    </v-alert>

    <v-card>
      <v-data-table
        :headers="headers"
        :items="userStore.items"
        :loading="userStore.loading"
        item-value="id"
      >
        <template #item.active="{ item }">
          <v-chip :color="item.active ? 'success' : 'default'" size="small" variant="tonal">
            {{ item.active ? 'Ativo' : 'Inativo' }}
          </v-chip>
        </template>
        <template #item.actions="{ item }">
          <v-btn icon="mdi-pencil" variant="text" size="small" @click="openEdit(item)" />
          <v-btn icon="mdi-delete" variant="text" size="small" @click="handleDelete(item)" />
        </template>
      </v-data-table>
    </v-card>

    <UserFormDialog v-model="dialogOpen" :editing-user="editingUser" @submit="handleSubmit" />
  </div>
</template>
