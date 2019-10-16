import { toColor } from '@o/color'
import { CompiledTheme, createThemes } from 'gloss'
import { fromStyles } from 'gloss-theme'

import { coats } from './themeCoats'
import { dark } from './themeDark'
import { light } from './themeLight'

export const themes: { [key: string]: CompiledTheme } = createThemes({
  ...coats,
  dark,
  light,
  tooltip: fromStyles({
    background: toColor('rgba(20,20,20,0.94)'),
    backgroundHover: toColor('rgba(28,28,28,0.94)'),
    backgroundStronger: toColor('rgba(30,30,30)'),
    backgroundStrongest: toColor('rgba(40,40,40)'),
    borderColor: toColor('rgba(40,40,40)'),
    color: toColor('#fff'),
    backgroundHighlight: toColor('#363165'),
    separatorBackground: toColor('rgba(30,30,30)'),
  }),
})

if (typeof window !== 'undefined' && !window['themes']) {
  window['themes'] = themes
}
