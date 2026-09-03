import { Outlet } from 'react-router-dom'

// Layout minimalista para páginas públicas (login, registro, recuperar senha).
// Sem AppBar/Drawer: só centraliza o conteúdo na tela.
export function AuthLayout() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Outlet />
    </div>
  )
}
