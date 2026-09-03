import { useEffect, useState } from 'react'
import {
  Alert,
  Button,
  Chip,
  IconButton,
  LinearProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import { Add, Delete, Edit } from '@mui/icons-material'

import { useUserStore } from '@/features/users/store/userStore'
import { UserFormDialog } from '@/features/users/components/UserFormDialog'
import type { CreateUserPayload, User } from '@/features/users/types/user'

export function UsersListPage() {
  const { items, loading, error, fetchAll, create, update, remove } = useUserStore()

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)

  useEffect(() => {
    fetchAll()
  }, [fetchAll])

  function openCreate() {
    setEditingUser(null)
    setDialogOpen(true)
  }

  function openEdit(user: User) {
    setEditingUser(user)
    setDialogOpen(true)
  }

  async function handleSubmit(payload: CreateUserPayload) {
    if (editingUser) {
      await update(editingUser.id, payload)
    } else {
      await create(payload)
    }
    setDialogOpen(false)
  }

  async function handleDelete(user: User) {
    if (confirm(`Remover ${user.name}?`)) {
      await remove(user.id)
    }
  }

  return (
    <div className="p-4 md:p-6">
      <div className="mb-4 flex items-center justify-between">
        <Typography variant="h5" className="font-semibold">
          Usuários
        </Typography>
        <Button variant="contained" startIcon={<Add />} onClick={openCreate}>
          Novo usuário
        </Button>
      </div>

      {error && (
        <Alert severity="error" className="mb-4">
          {error}
        </Alert>
      )}

      <Paper variant="outlined">
        {loading && <LinearProgress />}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nome</TableCell>
                <TableCell>E-mail</TableCell>
                <TableCell>Papel</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right" />
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((user) => (
                <TableRow key={user.id} hover>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>
                    <Chip
                      label={user.active ? 'Ativo' : 'Inativo'}
                      color={user.active ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton size="small" onClick={() => openEdit(user)}>
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleDelete(user)}>
                      <Delete fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {!loading && items.length === 0 && (
          <Typography variant="body2" color="text.secondary" className="p-6 text-center">
            Nenhum usuário cadastrado.
          </Typography>
        )}
      </Paper>

      <UserFormDialog
        open={dialogOpen}
        editingUser={editingUser}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleSubmit}
      />
    </div>
  )
}
