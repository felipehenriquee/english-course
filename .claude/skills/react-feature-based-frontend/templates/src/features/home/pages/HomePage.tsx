import { Card, Typography } from '@mui/material'
import { useAuthStore } from '@/features/auth/store/authStore'

export function HomePage() {
  const user = useAuthStore((state) => state.user)

  return (
    <div className="p-4 md:p-6">
      <Typography variant="h5" className="font-semibold">
        Olá{user?.name ? `, ${user.name}` : ''} 👋
      </Typography>
      <Typography variant="body2" color="text.secondary" className="mt-1">
        Esta é a página principal, protegida por autenticação.
      </Typography>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card variant="outlined" className="!p-4">
          <Typography variant="body2" color="text.secondary">
            Exemplo de card
          </Typography>
          <Typography variant="h4" className="font-semibold">
            42
          </Typography>
        </Card>
      </div>
    </div>
  )
}
