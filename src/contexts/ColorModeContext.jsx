import { createContext, useContext, useState, useMemo, useEffect } from 'react'
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles'
import { getTheme } from '../theme'

const ColorModeContext = createContext({
  toggleColorMode: () => {},
  mode: 'light',
})

export const useColorMode = () => {
  return useContext(ColorModeContext)
}

export const ColorModeProvider = ({ children }) => {
  const [mode, setMode] = useState(() => {
    const savedMode = localStorage.getItem('colorMode')
    return savedMode || 'light'
  })

  useEffect(() => {
    localStorage.setItem('colorMode', mode)
  }, [mode])

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'))
      },
      mode,
    }),
    [mode],
  )

  const theme = useMemo(() => getTheme(mode), [mode])

  return (
    <ColorModeContext.Provider value={colorMode}>
      <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
    </ColorModeContext.Provider>
  )
}
