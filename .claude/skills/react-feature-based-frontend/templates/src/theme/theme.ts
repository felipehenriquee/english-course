import { createTheme } from '@mui/material/styles'

/**
 * Tema único do MUI. Reaproveita as mesmas cores do tailwind.config.ts
 * (brand.*) para manter consistência visual entre componentes MUI e
 * classes utilitárias do Tailwind.
 */
export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#1a52ff' },
    secondary: { main: '#0c31a8' },
    error: { main: '#dc2626' },
    success: { main: '#16a34a' },
    warning: { main: '#d97706' },
    info: { main: '#0284c7' },
    background: { default: '#f8fafc' },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { textTransform: 'none' },
      },
    },
  },
})
