import { useContext } from 'react'
import { ThemeSelect } from '../theme/Theme'
import { ThemeContext } from '../theme/ThemeContext'
import { preProcessTheme } from './preProcessTheme'

// can optionally pass in props accepted by theme

export function useTheme(props?: { themeSelect?: ThemeSelect; alt?: string }) {
  const theme = useContext(ThemeContext).activeTheme
  if (props) {
    return preProcessTheme(props, theme)
  }
  return theme
}
