import { useState } from 'react'
import { Outlet, useNavigate, Link as RouterLink, useLocation } from 'react-router-dom'
import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from '@mui/material'
import { Dashboard, Group, Logout, Menu as MenuIcon } from '@mui/icons-material'

import { useAuthStore } from '@/features/auth/store/authStore'

const DRAWER_WIDTH = 240

const navItems = [
  { label: 'Início', icon: <Dashboard />, to: '/' },
  { label: 'Usuários', icon: <Group />, to: '/users' },
]

export function DefaultLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)
  const [drawerOpen, setDrawerOpen] = useState(true)

  async function handleLogout() {
    await logout()
    navigate('/login')
  }

  return (
    <Box className="flex">
      <AppBar
        position="fixed"
        className="!z-10"
        sx={{ width: '100%' }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={() => setDrawerOpen((v) => !v)}
            className="!mr-2"
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className="flex-1">
            {import.meta.env.VITE_APP_NAME ?? 'App'}
          </Typography>
          {user && (
            <Typography variant="body2" className="mr-3 hidden sm:inline">
              {user.name}
            </Typography>
          )}
          <IconButton color="inherit" title="Sair" onClick={handleLogout}>
            <Logout />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="persistent"
        open={drawerOpen}
        sx={{
          width: drawerOpen ? DRAWER_WIDTH : 0,
          flexShrink: 0,
          '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box' },
        }}
      >
        <Toolbar />
        <List>
          {navItems.map((item) => (
            <ListItemButton
              key={item.to}
              component={RouterLink}
              to={item.to}
              selected={location.pathname === item.to}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          ))}
        </List>
      </Drawer>

      <Box component="main" className="min-h-screen flex-1 bg-slate-50">
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  )
}
