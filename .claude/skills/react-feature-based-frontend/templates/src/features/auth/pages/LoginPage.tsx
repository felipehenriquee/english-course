import { useState, type FormEvent } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  Alert,
  Button,
  Card,
  CardContent,
  CircularProgress,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'

import { useAuthStore } from '@/features/auth/store/authStore'

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const login = useAuthStore((state) => state.login)
  const loading = useAuthStore((state) => state.loading)
  const error = useAuthStore((state) => state.error)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [touched, setTouched] = useState(false)

  const emailError = touched && !/.+@.+\..+/.test(email)
  const passwordError = touched && password.length === 0

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setTouched(true)
    if (emailError || passwordError) return

    try {
      await login({ email, password })
      const redirect = (location.state as { redirect?: string } | null)?.redirect ?? '/'
      navigate(redirect, { replace: true })
    } catch {
      // authStore.error já guarda a mensagem; exibida no Alert abaixo.
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <Card className="w-full max-w-sm" elevation={4}>
        <CardContent className="!p-6">
          <div className="mb-4 text-center">
            <Typography variant="h5" className="font-semibold">
              Bem-vindo de volta
            </Typography>
            <Typography variant="body2" color="text.secondary" className="mt-1">
              Entre com sua conta para continuar
            </Typography>
          </div>

          {error && (
            <Alert severity="error" className="mb-4">
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
            <TextField
              label="E-mail"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={emailError}
              helperText={emailError ? 'Informe um e-mail válido' : ' '}
              autoComplete="email"
              fullWidth
            />

            <TextField
              label="Senha"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={passwordError}
              helperText={passwordError ? 'Campo obrigatório' : ' '}
              autoComplete="current-password"
              fullWidth
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword((v) => !v)} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />

            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={loading}
              className="!mt-1 !h-11"
            >
              {loading ? <CircularProgress size={22} color="inherit" /> : 'Entrar'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
