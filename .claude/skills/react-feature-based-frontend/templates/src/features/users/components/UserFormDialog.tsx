import { useEffect, useState } from 'react'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  MenuItem,
  Switch,
  TextField,
} from '@mui/material'
import type { CreateUserPayload, User } from '@/features/users/types/user'

const ROLES: User['role'][] = ['admin', 'editor', 'viewer']

const emptyForm: CreateUserPayload = { name: '', email: '', role: 'viewer', active: true }

interface UserFormDialogProps {
  open: boolean
  editingUser: User | null
  onClose: () => void
  onSubmit: (payload: CreateUserPayload) => void
}

export function UserFormDialog({ open, editingUser, onClose, onSubmit }: UserFormDialogProps) {
  const [form, setForm] = useState<CreateUserPayload>(emptyForm)

  useEffect(() => {
    setForm(
      editingUser
        ? {
            name: editingUser.name,
            email: editingUser.email,
            role: editingUser.role,
            active: editingUser.active,
          }
        : emptyForm,
    )
  }, [editingUser, open])

  function handleSubmit() {
    if (!form.name || !form.email) return
    onSubmit(form)
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>{editingUser ? 'Editar usuário' : 'Novo usuário'}</DialogTitle>
      <DialogContent className="flex flex-col gap-4 !pt-2">
        <TextField
          label="Nome"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          fullWidth
        />
        <TextField
          label="E-mail"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          fullWidth
        />
        <TextField
          select
          label="Papel"
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value as User['role'] })}
          fullWidth
        >
          {ROLES.map((role) => (
            <MenuItem key={role} value={role}>
              {role}
            </MenuItem>
          ))}
        </TextField>
        <FormControlLabel
          control={
            <Switch
              checked={form.active}
              onChange={(e) => setForm({ ...form, active: e.target.checked })}
            />
          }
          label="Ativo"
        />
      </DialogContent>
      <DialogActions className="!px-6 !pb-4">
        <Button onClick={onClose}>Cancelar</Button>
        <Button variant="contained" onClick={handleSubmit}>
          Salvar
        </Button>
      </DialogActions>
    </Dialog>
  )
}
