import { themes as KitThemes } from '@o/kit'
import { linearGradient, toColor } from '@o/ui'
import { ThemeObject } from 'gloss'
import { colorize, fromStyles } from 'gloss-theme'

import { colors } from './colors'

const buttonBackground = linearGradient(colors.purple.lighten(0.035), colors.purple)

const selectedTheme = KitThemes.light.coats.selected as ThemeObject
const transparent = 'transparent'

const selectedMinimal = {
  ...colorize({
    color: selectedTheme.background,
    background: transparent,
    backgroundHover: transparent,
    backgroundActive: transparent,
  }),
}

const purple = fromStyles({
  background: colors.purple,
  color: '#fff',
})

const selected = {
  ...purple,
  // dont make selected things hover/active, they're active already
  backgroundHover: purple.background,
  backgroundActive: purple.background,
}

const light = {
  ...KitThemes.light,
  backgroundHighlightActive: colors.purple.lighten(0.1),
  backgroundHighlight: colors.purple,
  coats: {
    ...KitThemes.light.coats,
    selected,
    purple,
    selectedMinimal,
  },
  ...colorize({
    color: '#000',
  }),
}

const dark = {
  ...KitThemes.dark,
  coats: {
    ...KitThemes.dark.coats,
    selected,
    purple,
    selectedMinimal,
  },
  ...colorize({
    background: '#111',
    inputColor: '#fff',
    inputBackground: '#222',
    inputBackgroundHover: '#222',
    inputBackgroundActive: '#222',
    listItemBackgroundHover: 'rgba(255,255,255,0.075)',
    popoverBackground: '#111',
  }),
}

export const themes = {
  ...KitThemes,

  orbitOneDark: fromStyles({
    background: '#111',
    backgroundHover: '#111',
    borderColor: '#222',
    buttonBackground: buttonBackground,
    buttonBackgroundHover: buttonBackground.adjust(c => toColor(c).lighten(0.035)),
    color: '#fff',
  }),

  light,
  dark,

  docsPageTheme: {
    ...light,
    bodyBackground: toColor('#000'),
  },

  blogHeaderTheme: {
    ...dark,
    background: colors.purple,
  },

  darkAlt: {
    ...dark,
    ...fromStyles({
      color: '#fff',
      background: '#2C2B40',
      backgroundStrong: toColor('#2C2B40').lighten(0.1),
      buttonBackground: linearGradient('#2C2B40', toColor('#2C2B40').darken(0.1)),
      buttonBackgroundHover: linearGradient(toColor('#2C2B40').lighten(0.1), toColor('#2C2B40')),
      inputBackground: toColor('#2C2B40').darken(0.1),
      inputBackgroundHover: toColor('#2C2B40').darken(0.1),
    }),
  },

  home: {
    ...dark,
    ...colorize({
      background: '#000',
      inputBackground: '#111',
      inputBackgroundHover: '#111',
      inputBackgroundActive: '#111',
      listItemBackgroundHover: 'rgba(255,255,255,0.05)',
      popoverBackground: '#111',
    }),
  },
}

console.log(themes)
