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
    background: 'rgba(20,20,20,0.94)',
    backgroundHover: 'rgba(28,28,28,0.94)',
    backgroundStronger: 'rgba(30,30,30)',
    backgroundStrongest: 'rgba(40,40,40)',
    borderColor: 'rgba(40,40,40)',
    color: '#fff',
    backgroundHighlight: toColor('#363165'),
    separatorBackground: 'rgba(30,30,30)',
  }),
})

// @ts-ignore
if (typeof window !== 'undefiend' && !window['themes']) {
  // @ts-ignore
  window['themes'] = themes
}
