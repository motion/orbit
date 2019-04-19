import { useContext } from 'react'
import { Config } from '../config'
import { ThemeSelect } from '../theme/Theme'
import { ThemeContext } from '../theme/ThemeContext'

// can optionally pass in props accepted by theme

export function useTheme(props?: { themeSelect?: ThemeSelect; alt?: string }) {
  const theme = useContext(ThemeContext).activeTheme
  if (props) {
    return Config.preProcessTheme(props, theme)
  }
  return theme
}

export const useThemeContext = () => useContext(ThemeContext)
