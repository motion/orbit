import { toColor } from '@o/ui'
import { ThemeObject } from 'gloss'
import { fromStyles } from 'gloss-theme'

import { alternates } from './themeAlternates'
import { dark } from './themeDark'
import { light } from './themeLight'

export const themes: { [key: string]: ThemeObject } = {
  ...alternates,
  dark,
  light,
  tooltip: fromStyles({
    background: 'rgba(20,20,20,0.94)',
    backgroundHover: 'rgba(28,28,28,0.94)',
    backgroundStronger: 'rgba(30,30,30)',
    backgroundStrongest: 'rgba(40,40,40)',
    color: '#fff',
    backgroundHighlight: toColor('#363165'),
  }),
}
