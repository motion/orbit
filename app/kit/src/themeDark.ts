import { linearGradient, toColor } from '@o/color'
import { ThemeObject, ThemeSet } from '@o/css'
import { colorize, fromStyles } from 'gloss-theme'

import { coats } from './themeCoats'
import { transparent } from './themeColors'

const color = [255, 255, 255]
const colorLight = toColor([255, 255, 255, 0.9])
const colorLighter = toColor([255, 255, 255, 0.8])
const colorLightest = toColor([255, 255, 255, 0.7])
const background = toColor([25, 25, 25])
const borderColor = [180, 180, 180, 0.25]

const backgroundStrong = background.lighten(0.15)
const backgroundStronger = background.lighten(0.3)
const backgroundStrongest = background.lighten(0.45)

const darkFadeBackground = [0, 0, 0, 0.15]
const darkButtonBg = linearGradient([77, 77, 77], [70, 70, 70])

const darkenedCoats: ThemeSet = Object.keys(coats).reduce((acc, key) => {
  // for dark theme, make "light" themes darker
  if (key.indexOf('light') === 0) {
    acc[key] = fromStyles({
      background: coats[key].background!.darken(0.5).desaturate(0.2),
      borderColor: coats[key].borderColor!.darken(0.6).desaturate(0.2),
      color: '#fff',
    })
  }
  return acc
}, {})

const selectedColor = toColor('#363165')

const darkCoats: ThemeSet = {
  ...coats,
  ...darkenedCoats,
  delete: darkenedCoats.lightRed,
  error: darkenedCoats.lightRed,
  warn: darkenedCoats.lightYellow,
  approve: darkenedCoats.lightGreen,
  success: darkenedCoats.lightGreen,
  action: fromStyles({
    background: selectedColor.lighten(0.2),
    buttonBackground: linearGradient(selectedColor.lighten(0.2), selectedColor),
    color: '#fff',
  }),
  selected: colorize({
    color: '#fff',
    borderColor,
    background: selectedColor,
    backgroundHover: selectedColor,
    backgroundFocus: selectedColor,
    backgroundStrong: selectedColor.darken(0.1),
    backgroundStronger: selectedColor.darken(0.2),
    backgroundStrongest: selectedColor.darken(0.3),
  }),
  bordered: {
    ...coats.bordered,
    ...colorize({
      background: transparent,
      backgroundHover: transparent,
      backgroundActive: transparent,
      color,
      borderColor: [...color, 0.2],
      borderColorHover: [...color, 0.3],
    }),
  },
}

export const dark: ThemeObject = fromStyles({
  coats: darkCoats,
  backgroundZebra: background.lighten(0.2).setAlpha(0.35),
  backgroundStrongest,
  backgroundStronger,
  backgroundStrong,
  boxShadowOpacity: 0.32,
  boxShadowColor: toColor([0, 0, 0]),
  cardShadow: [0, 6, 14, [0, 0, 0, 0.08]],
  cardHoverGlow: [0, 0, 0, 2, [0, 0, 0, 0.15]],
  separatorBackground: backgroundStrong,
  colorLight,
  colorLighter,
  colorLightest,
  listItemBackground: transparent,
  background,
  backgroundHover: [20, 20, 20, 0.2],
  backgroundActive: [30, 30, 30, 0.5],
  backgroundHighlightActive: selectedColor,
  backgroundHighlight: selectedColor,
  color: color,
  colorHighlight: '#fff',
  colorHighlightActive: '#fff',
  borderColor,
  borderColorActive: borderColor,
  borderColorLight: [180, 180, 180, 0.15],
  appCardBackground: [15, 15, 15],
  appCardBackgroundTransparent: [15, 15, 15, 0],
  'orbitLauncherBackground-none': [30, 30, 30],
  'orbitLauncherBackground-some': [10, 10, 13, 0.2], // we use thicker vibrancy here
  'orbitLauncherBackground-more': [25, 25, 30, 0.4],
  orbitHeaderBackgroundEditing: linearGradient(
    selectedColor.lighten(0.1).setAlpha(0.5),
    selectedColor.setAlpha(0.5),
  ),
  orbitbackgroundEditing: [0, 0, 0, 0.2],
  colorBlur: '#bbb',
  colorActive: '#fff',
  glintColor: [255, 255, 255, 0.135],
  floatingBackground: [70, 70, 70],
  panelHeaderBackground: background.lighten(0.15),
  redTint: '#ff000011',
  yellowTint: '#FFCA0011',

  sidebar: {
    background: [15, 15, 15],
    backgroundTransparent: [15, 15, 15, 0.4],
    borderColor: '#444',
  },

  header: {
    borderBottom: '#151515',
    background: linearGradient([0, 0, 0, 0.4], [0, 0, 0, 0.3]),
    backgroundOpaque: linearGradient('#222', '#252525'),
    fadeBackground: linearGradient('to right', darkFadeBackground, transparent, darkFadeBackground),
  },

  button: {
    background: darkButtonBg,
    backgroundActive: [45, 45, 45, 0.8],
    backgroundHover: darkButtonBg.adjust(c => toColor(c).lighten(0.1)),
    borderColor: [45, 45, 45],
    borderColorActive: [45, 45, 45],
    borderColorHover: [40, 40, 40],
    glintColorBottom: [0, 0, 0, 0.3],
  },

  input: {
    background: transparent,
    backgroundHover: transparent,
    backgroundActive: transparent,
    backgroundFocus: transparent,
    backgroundSelection: '#444',
  },

  listItem: {
    background: transparent,
    backgroundSelected: [60, 60, 60, 0.2],
    backgroundHover: [20, 20, 20, 0.13],
  },

  tab: {
    colorActive: darkCoats.selected.background!.lighten(0.5),
    backgroundHover: [255, 255, 255, 0.1],
    backgroundActive: [255, 255, 255, 0.125],
    backgroundSelected: backgroundStronger,
  },

  card: {
    background: [110, 110, 110],
    backgroundHover: [110, 110, 110],
    backgroundActive: [110, 110, 110],
    borderColor: [255, 255, 255, 0.07],
    borderColorHover: [255, 255, 255, 0.15],
  },
})
