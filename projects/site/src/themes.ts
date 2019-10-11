import { themes as KitThemes } from '@o/kit'
import { linearGradient, toColor } from '@o/ui'
import { createThemes } from 'gloss'
import { colorize, fromStyles } from 'gloss-theme'

import { colors } from './colors'

const buttonBackground = linearGradient(colors.purple.lighten(0.035), colors.purple)

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
  },
}

const dark = {
  ...KitThemes.dark,
  coats: {
    ...KitThemes.dark.coats,
    selected,
    purple,
  },
  ...colorize({
    background: '#111',
    popoverBackground: '#111',
  }),
}

const home = {
  ...dark,
  ...colorize({
    background: '#000',
    backgroundHover: '#111',

    popover: {
      background: '#111',
    },
  }),
}

export const themes = createThemes({
  ...KitThemes,

  orbitOneDark: fromStyles({
    background: '#111',
    backgroundHover: '#111',
    borderColor: '#222',
    color: '#fff',

    button: {
      background: buttonBackground,
      backgroundHover: buttonBackground.adjust(c => toColor(c).lighten(0.035)),
    },
  }),

  light,

  dark: {
    ...dark,
    background: toColor('#080808'),
  },

  home,

  brown: {
    ...dark,
    background: toColor('#12100E'),
  },

  blogHeaderTheme: home,
  // {
  //   ...dark,
  //   background: toColor('#1b1917'),
  // },

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

  docsPageTheme: {
    ...light,
    color: toColor('#111'),
    bodyBackground: toColor('#000'),
  },
})

window['themes'] = themes
