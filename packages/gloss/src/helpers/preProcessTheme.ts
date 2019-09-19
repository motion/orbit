import { ThemeObject } from '@o/css'

import { GlossProps } from '../gloss'
import { getThemeCoat } from './getThemeCoat'
import { selectThemeSubset } from './selectThemeSubset'

// Default pre process theme is:
//   1. if coat="" prop, drill down to that theme
//   2. if themeSubSelect="" prop, select that subset of the theme

export const preProcessTheme = (props: GlossProps<any>, theme: ThemeObject) => {
  return selectThemeSubset(props.themeSubSelect, getThemeCoat(props.coat, theme))
}
