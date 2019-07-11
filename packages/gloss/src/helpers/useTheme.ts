import { useContext } from 'react'

import { Config } from '../config'
import { ThemeSelect } from '../theme/Theme'
import { ThemeContext } from '../theme/ThemeContext'

// can optionally pass in props accepted by theme

export function useTheme(props?: {
  subTheme?: ThemeSelect
  alt?: string
  ignoreAlternate?: boolean
}) {
  let theme = useContext(ThemeContext).activeTheme
  if (props && props.ignoreAlternate) {
    theme = theme._originalTheme || theme
  }
  if (
    props &&
    (typeof props.alt !== 'undefined' || typeof props.subTheme !== 'undefined') &&
    Config.preProcessTheme
  ) {
    return Config.preProcessTheme(props, theme)
  }
  return theme
}

export const useThemeContext = () => useContext(ThemeContext)
