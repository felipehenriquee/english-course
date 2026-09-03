import { Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'

export function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 text-center">
      <p className="text-6xl font-bold text-slate-300">404</p>
      <p className="text-slate-600">Página não encontrada</p>
      <Button variant="contained" onClick={() => navigate('/')}>
        Voltar para o início
      </Button>
    </div>
  )
}
