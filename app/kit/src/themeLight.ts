import { linearGradient, toColor } from '@o/color'
import { ThemeObject } from 'gloss'
import { fromStyles } from 'gloss-theme'

import { coats } from './themeCoats'
import { colors, transparent } from './themeColors'

const c = toColor
const color = toColor('#444')
const colorLight = color.lighten(0.1)
const colorLighter = color.lighten(0.2)
const colorLightest = color.lighten(0.3)
const lightBackground = toColor('#fff')
const lightButtonBg = linearGradient('#FCFCFC', '#F5F5F6')

const backgroundStrong = lightBackground.darken(0.025)
const backgroundStronger = lightBackground.darken(0.05)
const backgroundStrongest = lightBackground.darken(0.075)

export const light: ThemeObject = fromStyles({
  coats: coats,
  boxShadowOpacity: 0.01,
  colorLight,
  colorLighter,
  colorLightest,

  background: lightBackground,
  backgroundStrong,
  backgroundStronger,
  backgroundStrongest,
  iconFillColor: c('#000'),
  backgroundZebra: c('#f6f7f9aa'),
  backgroundHighlightActive: colors.blue.lighten(0.1),
  backgroundHighlight: colors.blue,
  boxShadowColor: c([0, 0, 0]),
  mainBackground: lightBackground,
  backgroundActive: c('#eee'),
  backgroundHover: c('#eee'),
  color,
  glintColor: c([255, 255, 255, 0.85]),
  colorHighlight: c('#fff'),
  colorHighlightActive: c('#fff'),
  borderColor: c([215, 215, 215]),
  borderColorActive: c([215, 215, 215]),
  borderColorHover: c([215, 215, 215]),
  borderColorLight: c([215, 215, 215, 0.5]),
  headerBackground: linearGradient([255, 255, 255, 0.3], [255, 255, 255, 0.25]),
  appCardBackground: c('#f5f7f9'),
  appCardBackgroundTransparent: c([255, 255, 255, 0]),
  'orbitLauncherBackground-none': c([255, 255, 255]),
  'orbitLauncherBackground-some': c([255, 255, 255, 0.15]),
  'orbitLauncherBackground-more': c([255, 255, 255, 0.15]),
  orbitLauncherSideBackground: c([255, 255, 255, 0.4]),
  orbitHeaderBackgroundEditing: linearGradient('#163278', '#192B5C'),
  orbitInputBackgroundEditing: c([0, 0, 0, 0.2]),
  separatorBackground: backgroundStrong.setAlpha(0.5),

  lightItem: {
    background: transparent,
  },

  button: {
    background: lightButtonBg,
    backgroundActive: linearGradient('#e9e9e9', '#eee'),
    // buttonBackgroundFocus: lightButtonBg,
    boxShadowFocus: '2px 2px red',
    backgroundHover: lightButtonBg.adjust(x => toColor(x).lighten(0.025)),
    glintColorBottom: c([0, 0, 0, 0.08]),
  },

  tab: {
    backgroundHover: c([0, 0, 0, 0.1]),
    backgroundActive: c([0, 0, 0, 0.15]),
    backgroundSelected: lightBackground,
  },

  sidebar: {
    background: c('#f5f7f9'),
    backgroundTransparent: c([255, 255, 255, 0.7]),
  },

  card: {
    background: c([255, 255, 255]),
    backgroundHover: c([255, 255, 255]),
    backgroundActive: c([255, 255, 255]),
    borderColor: c([0, 0, 0, 0.1]),
    boxShadow: [0, 6, 14, [0, 0, 0, 0.058]],
    hoverGlow: [0, 0, 0, 2, [0, 0, 0, 0.05]],
  },

  input: {
    background: c('#fff'),
    backgroundHover: c('#fff'),
    backgroundActive: c('#fff'),
    borderColorActive: c([215, 215, 215]),
    backgroundSelection: c('#ddd'),
  },
})
