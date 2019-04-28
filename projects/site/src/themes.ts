import { linearGradient, ThemeMaker, toColor } from '@o/gloss'
import { themes as KitThemes } from '@o/kit'

import { colors } from './constants'

const Theme = new ThemeMaker()

const buttonBackground = linearGradient(colors.purple.lighten(0.035), colors.purple)

export const themes = {
  ...KitThemes,

  orbitOneDark: Theme.fromStyles({
    background: '#111',
    backgroundHover: '#111',
    borderColor: '#222',
    buttonBackground: buttonBackground,
    buttonBackgroundHover: buttonBackground.adjust(c => toColor(c).lighten(0.035)),
    color: '#fff',
  }),

  orbitOne: Theme.fromStyles({
    background: '#fff',
    color: colors.purple,
  }),

  orbitTwo: Theme.fromStyles({
    background: colors.red,
    color: colors.purple,
  }),

  orbitThree: Theme.fromStyles({
    background: colors.purple,
    color: colors.red,
  }),

  light: {
    ...KitThemes.light,

    alternates: {
      ...KitThemes.light.alternates,

      selected: Theme.colorize({
        ...KitThemes.light.alternates.selected,
        color: '#000',
        background: '#f2f2f2',
        backgroundHover: '#f2f2f2',
        backgroundActive: '#f2f2f2',
        borderColor: 'transparent',
      }),
    },

    ...Theme.colorize({
      color: '#000',
    }),
  },

  dark: {
    ...KitThemes.dark,
    ...Theme.colorize({
      background: '#111',
      inputBackground: '#222',
      inputBackgroundHover: '#222',
      inputBackgroundActive: '#222',
      listItemBackgroundHover: 'rgba(255,255,255,0.075)',
      popoverBackground: '#111',
    }),
  },

  darkAlt: {
    ...KitThemes.dark,
    ...Theme.fromStyles({
      color: '#fff',
      background: '#2C2B40',
    }),
  },

  home: {
    ...KitThemes.dark,
    ...Theme.colorize({
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
