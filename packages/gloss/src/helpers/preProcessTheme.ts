import { ThemeObject } from '@o/css'

import { getAlternateTheme } from './getAlternateTheme'
import { selectThemeSubset } from './selectThemeSubset'

// Default pre process theme is:
//   1. if is="" prop, drill down to that theme
//   2. if subTheme="" prop, select that subset of the theme

// chaining syntax swould be nice here

export const preProcessTheme = (props: any, theme: ThemeObject) => {
  return selectThemeSubset(props.subTheme, getAlternateTheme(props.alt, theme))
}
