import { createTheme } from '@mui/material/styles'

export const getTheme = (mode) => createTheme({
  palette: {
    mode,
    primary: {
      main: '#00A4B4',
      light: '#33B8C5',
      dark: '#008A99',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#ec4899',
      light: '#f472b6',
      dark: '#db2777',
      contrastText: '#ffffff',
    },
    success: {
      main: '#10b981',
      light: '#34d399',
      dark: '#059669',
    },
    warning: {
      main: '#f59e0b',
      light: '#fbbf24',
      dark: '#d97706',
    },
    error: {
      main: '#ef4444',
      light: '#f87171',
      dark: '#dc2626',
    },
    info: {
      main: '#3b82f6',
      light: '#60a5fa',
      dark: '#2563eb',
    },
    background: {
      default: mode === 'light' ? '#f8fafc' : '#0f172a',
      paper: mode === 'light' ? '#ffffff' : '#1e293b',
    },
    text: {
      primary: mode === 'light' ? '#1e293b' : '#f8fafc',
      secondary: mode === 'light' ? '#64748b' : '#94a3b8',
    },
    divider: mode === 'light' ? '#e2e8f0' : '#334155',
  },
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
    h1: {
      fontWeight: 800,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
    h3: {
      fontWeight: 700,
      letterSpacing: '-0.01em',
    },
    h4: {
      fontWeight: 700,
      letterSpacing: '-0.01em',
    },
    h5: {
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
    h6: {
      fontWeight: 600,
      letterSpacing: '-0.005em',
    },
    subtitle1: {
      fontWeight: 500,
      letterSpacing: '0em',
    },
    subtitle2: {
      fontWeight: 500,
      letterSpacing: '0em',
    },
    body1: {
      letterSpacing: '0em',
    },
    body2: {
      letterSpacing: '0em',
    },
    button: {
      fontWeight: 600,
      letterSpacing: '0.01em',
    },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: mode === 'light' ? [
    'none',
    '0px 1px 2px 0px rgba(0, 0, 0, 0.05)',
    '0px 1px 3px 0px rgba(0, 0, 0, 0.1), 0px 1px 2px 0px rgba(0, 0, 0, 0.06)',
    '0px 4px 6px -1px rgba(0, 0, 0, 0.1), 0px 2px 4px -1px rgba(0, 0, 0, 0.06)',
    '0px 10px 15px -3px rgba(0, 0, 0, 0.1), 0px 4px 6px -2px rgba(0, 0, 0, 0.05)',
    '0px 20px 25px -5px rgba(0, 0, 0, 0.1), 0px 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '0px 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '0px 0px 0px 1px rgba(0, 0, 0, 0.05), 0px 10px 15px -3px rgba(0, 0, 0, 0.1)',
    '0px 0px 0px 1px rgba(0, 0, 0, 0.05), 0px 20px 25px -5px rgba(0, 0, 0, 0.1)',
    '0px 0px 0px 1px rgba(0, 0, 0, 0.05), 0px 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '0px 0px 0px 1px rgba(0, 0, 0, 0.05), 0px 30px 60px -15px rgba(0, 0, 0, 0.3)',
    '0px 0px 0px 1px rgba(0, 0, 0, 0.05), 0px 35px 70px -20px rgba(0, 0, 0, 0.35)',
    '0px 0px 0px 1px rgba(0, 0, 0, 0.05), 0px 40px 80px -25px rgba(0, 0, 0, 0.4)',
    '0px 0px 0px 1px rgba(0, 0, 0, 0.05), 0px 45px 90px -30px rgba(0, 0, 0, 0.45)',
    '0px 0px 0px 1px rgba(0, 0, 0, 0.05), 0px 50px 100px -35px rgba(0, 0, 0, 0.5)',
    '0px 0px 0px 1px rgba(0, 0, 0, 0.05), 0px 55px 110px -40px rgba(0, 0, 0, 0.55)',
    '0px 0px 0px 1px rgba(0, 0, 0, 0.05), 0px 60px 120px -45px rgba(0, 0, 0, 0.6)',
    '0px 0px 0px 1px rgba(0, 0, 0, 0.05), 0px 65px 130px -50px rgba(0, 0, 0, 0.65)',
    '0px 0px 0px 1px rgba(0, 0, 0, 0.05), 0px 70px 140px -55px rgba(0, 0, 0, 0.7)',
    '0px 0px 0px 1px rgba(0, 0, 0, 0.05), 0px 75px 150px -60px rgba(0, 0, 0, 0.75)',
    '0px 0px 0px 1px rgba(0, 0, 0, 0.05), 0px 80px 160px -65px rgba(0, 0, 0, 0.8)',
    '0px 0px 0px 1px rgba(0, 0, 0, 0.05), 0px 85px 170px -70px rgba(0, 0, 0, 0.85)',
    '0px 0px 0px 1px rgba(0, 0, 0, 0.05), 0px 90px 180px -75px rgba(0, 0, 0, 0.9)',
    '0px 0px 0px 1px rgba(0, 0, 0, 0.05), 0px 95px 190px -80px rgba(0, 0, 0, 0.95)',
    '0px 0px 0px 1px rgba(0, 0, 0, 0.05), 0px 100px 200px -85px rgba(0, 0, 0, 1)',
  ] : [
    'none',
    '0px 1px 2px 0px rgba(0, 0, 0, 0.3)',
    '0px 1px 3px 0px rgba(0, 0, 0, 0.5), 0px 1px 2px 0px rgba(0, 0, 0, 0.4)',
    '0px 4px 6px -1px rgba(0, 0, 0, 0.5), 0px 2px 4px -1px rgba(0, 0, 0, 0.4)',
    '0px 10px 15px -3px rgba(0, 0, 0, 0.5), 0px 4px 6px -2px rgba(0, 0, 0, 0.4)',
    '0px 20px 25px -5px rgba(0, 0, 0, 0.5), 0px 10px 10px -5px rgba(0, 0, 0, 0.4)',
    '0px 25px 50px -12px rgba(0, 0, 0, 0.7)',
    // ... simplified dark shadows for higher elevations
    '0px 0px 0px 1px rgba(255, 255, 255, 0.05), 0px 10px 15px -3px rgba(0, 0, 0, 0.5)',
    '0px 0px 0px 1px rgba(255, 255, 255, 0.05), 0px 20px 25px -5px rgba(0, 0, 0, 0.5)',
    '0px 0px 0px 1px rgba(255, 255, 255, 0.05), 0px 25px 50px -12px rgba(0, 0, 0, 0.7)',
    // Fill rest with generic dark shadow
    ...Array(15).fill('0px 0px 0px 1px rgba(255, 255, 255, 0.05), 0px 25px 50px -12px rgba(0, 0, 0, 0.7)'),
  ],
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarWidth: 'thin',
          scrollbarColor: mode === 'light' ? '#cbd5e1 transparent' : '#475569 transparent',
          '&::-webkit-scrollbar': {
            width: 8,
            height: 8,
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            background: mode === 'light' ? '#cbd5e1' : '#475569',
            borderRadius: 4,
            '&:hover': {
              background: mode === 'light' ? '#94a3b8' : '#64748b',
            },
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: mode === 'light' 
            ? '0px 1px 3px 0px rgba(0, 0, 0, 0.1), 0px 1px 2px 0px rgba(0, 0, 0, 0.06)'
            : '0px 1px 3px 0px rgba(0, 0, 0, 0.5), 0px 1px 2px 0px rgba(0, 0, 0, 0.4)',
          border: `1px solid ${mode === 'light' ? '#f1f5f9' : '#334155'}`,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: mode === 'light'
              ? '0px 10px 15px -3px rgba(0, 0, 0, 0.1), 0px 4px 6px -2px rgba(0, 0, 0, 0.05)'
              : '0px 10px 15px -3px rgba(0, 0, 0, 0.5), 0px 4px 6px -2px rgba(0, 0, 0, 0.4)',
            borderColor: mode === 'light' ? '#e2e8f0' : '#475569',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: 'none',
          fontWeight: 600,
          padding: '10px 24px',
          boxShadow: 'none',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            boxShadow: mode === 'light'
              ? '0px 4px 6px -1px rgba(0, 0, 0, 0.1), 0px 2px 4px -1px rgba(0, 0, 0, 0.06)'
              : '0px 4px 6px -1px rgba(0, 0, 0, 0.5), 0px 2px 4px -1px rgba(0, 0, 0, 0.4)',
            transform: 'translateY(-1px)',
          },
        },
        contained: {
          '&:hover': {
            boxShadow: mode === 'light'
              ? '0px 10px 15px -3px rgba(0, 0, 0, 0.1), 0px 4px 6px -2px rgba(0, 0, 0, 0.05)'
              : '0px 10px 15px -3px rgba(0, 0, 0, 0.5), 0px 4px 6px -2px rgba(0, 0, 0, 0.4)',
          },
        },
        sizeLarge: {
          padding: '12px 32px',
          fontSize: '1rem',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#00A4B4',
              },
            },
            '&.Mui-focused': {
              boxShadow: '0 0 0 3px rgba(0, 164, 180, 0.1)',
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
          borderRadius: 8,
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        },
        filled: {
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: mode === 'light'
              ? '0px 4px 6px -1px rgba(0, 0, 0, 0.1)'
              : '0px 4px 6px -1px rgba(0, 0, 0, 0.5)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
        rounded: {
          borderRadius: 16,
        },
        elevation1: {
          boxShadow: mode === 'light'
            ? '0px 1px 2px 0px rgba(0, 0, 0, 0.05)'
            : '0px 1px 2px 0px rgba(0, 0, 0, 0.3)',
        },
        elevation2: {
          boxShadow: mode === 'light'
            ? '0px 1px 3px 0px rgba(0, 0, 0, 0.1), 0px 1px 2px 0px rgba(0, 0, 0, 0.06)'
            : '0px 1px 3px 0px rgba(0, 0, 0, 0.5), 0px 1px 2px 0px rgba(0, 0, 0, 0.4)',
        },
        elevation3: {
          boxShadow: mode === 'light'
            ? '0px 4px 6px -1px rgba(0, 0, 0, 0.1), 0px 2px 4px -1px rgba(0, 0, 0, 0.06)'
            : '0px 4px 6px -1px rgba(0, 0, 0, 0.5), 0px 2px 4px -1px rgba(0, 0, 0, 0.4)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: mode === 'light'
            ? '0px 1px 3px 0px rgba(0, 0, 0, 0.1), 0px 1px 2px 0px rgba(0, 0, 0, 0.06)'
            : '0px 1px 3px 0px rgba(0, 0, 0, 0.5), 0px 1px 2px 0px rgba(0, 0, 0, 0.4)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: `1px solid ${mode === 'light' ? '#f1f5f9' : '#334155'}`,
          boxShadow: 'none',
        },
      },
    },
  },
})

