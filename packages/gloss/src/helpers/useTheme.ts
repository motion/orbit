import { useContext } from 'react'

import { Config } from '../configureGloss'
import { ThemeSelect } from '../theme/Theme'
import { ThemeContext } from '../theme/ThemeContext'

// can optionally pass in props accepted by theme

export function useTheme(props?: {
  themeSubSelect?: ThemeSelect
  coat?: string | false
  ignroeCoat?: boolean
}) {
  let theme = useContext(ThemeContext).activeTheme
  if (props && props.ignroeCoat) {
    theme = theme._originalTheme || theme
  }
  if (
    props &&
    (typeof props.coat !== 'undefined' || typeof props.themeSubSelect !== 'undefined') &&
    Config.preProcessTheme
  ) {
    return Config.preProcessTheme(props, theme)
  }
  return theme
}

export const useThemeContext = () => useContext(ThemeContext)
