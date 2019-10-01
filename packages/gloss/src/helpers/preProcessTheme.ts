import { GlossProps } from '../gloss'
import { CompiledTheme } from '../theme/createTheme'
import { getThemeCoat } from './getThemeCoat'
import { selectThemeSubset } from './selectThemeSubset'

// Default pre process theme is:
//   1. if coat="" prop, drill down to that theme
//   2. if themeSubSelect="" prop, select that subset of the theme

export const preProcessTheme = (props: GlossProps<any>, theme: CompiledTheme) => {
  return selectThemeSubset(props.themeSubSelect, getThemeCoat(props.coat, theme))
}
