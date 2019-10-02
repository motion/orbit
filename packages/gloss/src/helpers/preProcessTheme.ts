import { GlossProps } from '../gloss'
import { CompiledTheme } from '../theme/createTheme'
import { getThemeCoat } from './getThemeCoat'
import { selectThemeSubset } from './selectThemeSubset'
import { UnwrapTheme } from './useTheme'

// Default pre process theme is:
//   1. if coat="" prop, drill down to that theme
//   2. if themeSubSelect="" prop, select that subset of the theme

export const preProcessTheme = (props: GlossProps<any>, theme: CompiledTheme) => {
  // @ts-ignore
  theme = theme[UnwrapTheme] || theme
  // TODO we should handle all caching + naming here not in getThemeCoat and selectThemeSubset
  const coatTheme = getThemeCoat(props.coat, theme)
  const subSetTheme = selectThemeSubset(props.themeSubSelect, coatTheme)
  return subSetTheme
}
