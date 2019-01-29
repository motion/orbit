import { useContext } from 'react'
import { ThemeContext } from '../theme/ThemeContext'

export function useTheme() {
  return useContext(ThemeContext).activeTheme
}
