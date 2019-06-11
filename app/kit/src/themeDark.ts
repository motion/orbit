import { linearGradient, toColor } from '@o/color'
import { ThemeObject, ThemeSet } from '@o/css'
import { colorize, fromStyles } from 'gloss-theme'

import { alternates } from './themeAlternates'
import { transparent } from './themeColors'

const color = [255, 255, 255]
const background = toColor([30, 30, 30])
const borderColor = [180, 180, 180, 0.25]

const backgroundStrong = background.lighten(0.15)
const backgroundStronger = background.lighten(0.3)
const backgroundStrongest = background.lighten(0.45)

const darkFadeBackground = [0, 0, 0, 0.15]
const darkButtonBg = linearGradient([77, 77, 77], [70, 70, 70])

const darkAltLight: ThemeSet = Object.keys(alternates).reduce((acc, key) => {
  // for dark theme, make "light" themes translucent
  if (key.indexOf('light') === 0) {
    acc[key] = fromStyles({
      background: alternates[key].background.alpha(0.25),
      borderColor: alternates[key].borderColor.alpha(0.3),
      color: '#fff',
    })
  }
  return acc
}, {})

const selectedColor = toColor('#363165')

const darkAlternates: ThemeSet = {
  ...alternates,
  ...darkAltLight,
  error: darkAltLight.lightRed,
  warn: darkAltLight.lightYellow,
  approve: darkAltLight.lightGreen,
  success: darkAltLight.lightGreen,
  selected: colorize({
    color: '#fff',
    borderColor,
    background: selectedColor,
    backgroundHover: selectedColor,
    backgroundFocus: selectedColor,
  }),
  bordered: {
    ...alternates.bordered,
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
  alternates: darkAlternates,
  backgroundZebra: background.lighten(0.2).alpha(0.35),
  backgroundZebraHover: background.lighten(0.4).alpha(0.35),
  backgroundStrongest,
  backgroundStronger,
  backgroundStrong,
  separatorBackground: backgroundStrong,
  ...fromStyles({
    background,
    backgroundHover: [20, 20, 20, 0.2],
    backgroundActive: [30, 30, 30, 0.65],
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
    sidebarBackgroundTransparent: [15, 15, 15, 0.2],
    sidebarBorderColor: '#444',
    headerBorderBottom: '#151515',
    headerBackground: linearGradient([0, 0, 0, 0.2], [0, 0, 0, 0.34]),
    headerBackgroundOpaque: linearGradient('#3f3f3f', '#353535'),
    orbitHeaderBackgroundEditing: linearGradient('#163278', '#192B5C'),
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
    buttonBorderColor: [35, 35, 35],
    buttonBorderColorActive: [35, 35, 35],
    buttonBorderColorHover: [40, 40, 40],
    buttonGlintColorBottom: [0, 0, 0, 0.3],
    colorBlur: '#bbb',
    colorActive: '#fff',
    tabColorActive: darkAlternates.selected.background.lighten(0.5),
    tabBackgroundHover: [255, 255, 255, 0.1],
    tabBackgroundActive: [255, 255, 255, 0.125],
    tabBackgroundSelected: dark.backgroundStronger,
    glintColor: [255, 255, 255, 0.135],
    inputBackground: transparent,
    inputBackgroundHover: transparent,
    inputBackgroundActive: transparent,
    inputBackgroundFocus: transparent,
    inputBackgroundSelection: '#111',
    listItemBackground: transparent,
    listItemBackgroundSelected: [60, 60, 60, 0.2],
    listItemBackgroundHover: [20, 20, 20, 0.13],
    floatingBackground: [70, 70, 70],
    cardBackground: [110, 110, 110, 0.4],
    cardBackgroundHover: [110, 110, 110, 0.4],
    cardBackgroundActive: [110, 110, 110, 0.4],
    cardBorderColor: [255, 255, 255, 0.07],
    cardBorderColorHover: [255, 255, 255, 0.15],
    cardShadow: [0, 6, 14, [0, 0, 0, 0.08]],
    cardHoverGlow: [0, 0, 0, 2, [0, 0, 0, 0.15]],
    panelHeaderBackground: background.lighten(0.15),
    redTint: '#ff000011',
    yellowTint: '#FFCA0011',
  }),
)
