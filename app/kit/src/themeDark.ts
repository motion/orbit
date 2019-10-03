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

export const dark: ThemeObject = {
  coats: darkCoats,
  backgroundZebra: background.lighten(0.2).setAlpha(0.35),
  backgroundStrongest,
  backgroundStronger,
  backgroundStrong,
  boxShadowOpacity: 0.32,
  // elevatedShadowY: (elevation: number) => smoother(x, 1),
  // elevatedShadowSpread: (elevation: number) => smoother(x, 1),
  // elevatedShadowColor: (elevation: number) => smoother(x, 1),
  boxShadowColor: toColor([0, 0, 0]),
  cardShadow: [0, 6, 14, [0, 0, 0, 0.08]],
  cardHoverGlow: [0, 0, 0, 2, [0, 0, 0, 0.15]],
  separatorBackground: backgroundStrong,
  colorLight,
  colorLighter,
  colorLightest,
  ...fromStyles({
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
  }),
}

// makes it so we can reference the above base styles for the rest

Object.assign(
  dark,
  colorize({
    sidebarBackground: [15, 15, 15],
    sidebarBackgroundTransparent: [15, 15, 15, 0.4],
    appCardBackground: [15, 15, 15],
    appCardBackgroundTransparent: [15, 15, 15, 0],
    'orbitLauncherBackground-none': [30, 30, 30],
    'orbitLauncherBackground-some': [10, 10, 13, 0.2], // we use thicker vibrancy here
    'orbitLauncherBackground-more': [25, 25, 30, 0.4],
    sidebarBorderColor: '#444',
    headerBorderBottom: '#151515',
    headerBackground: linearGradient([0, 0, 0, 0.4], [0, 0, 0, 0.3]),
    headerBackgroundOpaque: linearGradient('#222', '#252525'),
    orbitHeaderBackgroundEditing: linearGradient(
      selectedColor.lighten(0.1).setAlpha(0.5),
      selectedColor.setAlpha(0.5),
    ),
    orbitInputBackgroundEditing: [0, 0, 0, 0.2],
    headerFadeBackground: linearGradient(
      'to right',
      darkFadeBackground,
      transparent,
      darkFadeBackground,
    ),
    buttonBackground: darkButtonBg,
    buttonBackgroundActive: [45, 45, 45, 0.8],
    buttonBackgroundHover: darkButtonBg.adjust(c => toColor(c).lighten(0.1)),
    buttonBorderColor: [45, 45, 45],
    buttonBorderColorActive: [45, 45, 45],
    buttonBorderColorHover: [40, 40, 40],
    buttonGlintColorBottom: [0, 0, 0, 0.3],
    colorBlur: '#bbb',
    colorActive: '#fff',
    tabColorActive: darkCoats.selected.background!.lighten(0.5),
    tabBackgroundHover: [255, 255, 255, 0.1],
    tabBackgroundActive: [255, 255, 255, 0.125],
    tabBackgroundSelected: dark.backgroundStronger,
    glintColor: [255, 255, 255, 0.135],
    inputBackground: transparent,
    inputBackgroundHover: transparent,
    inputBackgroundActive: transparent,
    inputBackgroundFocus: transparent,
    inputBackgroundSelection: '#444',
    listItemBackground: transparent,
    listItemBackgroundSelected: [60, 60, 60, 0.2],
    listItemBackgroundHover: [20, 20, 20, 0.13],
    floatingBackground: [70, 70, 70],
    cardBackground: [110, 110, 110],
    cardBackgroundHover: [110, 110, 110],
    cardBackgroundActive: [110, 110, 110],
    cardBorderColor: [255, 255, 255, 0.07],
    cardBorderColorHover: [255, 255, 255, 0.15],
    panelHeaderBackground: background.lighten(0.15),
    redTint: '#ff000011',
    yellowTint: '#FFCA0011',
  }),
)
