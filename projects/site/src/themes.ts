import { ThemeMaker } from '@o/gloss'
import { themes as KitThemes } from '@o/kit'

const Theme = new ThemeMaker()

export const themes = {
  ...KitThemes,

  light: {
    ...KitThemes.light,
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
