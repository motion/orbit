import { toColor } from '@o/color'
import { CompiledTheme, createTheme } from 'gloss'
import { fromStyles } from 'gloss-theme'

import { coats } from './themeCoats'
import { dark } from './themeDark'
import { light } from './themeLight'

export const themes: { [key: string]: CompiledTheme } = {
  ...Object.keys(coats).reduce((acc, key) => {
    acc[key] = createTheme(coats[key])
    return acc
  }, {}),
  dark: createTheme(dark),
  light: createTheme(light),
  tooltip: createTheme(
    fromStyles({
      background: 'rgba(20,20,20,0.94)',
      backgroundHover: 'rgba(28,28,28,0.94)',
      backgroundStronger: 'rgba(30,30,30)',
      backgroundStrongest: 'rgba(40,40,40)',
      borderColor: 'rgba(40,40,40)',
      color: '#fff',
      backgroundHighlight: toColor('#363165'),
      separatorBackground: 'rgba(30,30,30)',
    }),
  ),
}
