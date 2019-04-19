import { ThemeMaker } from '@o/gloss'
import { themes as KitThemes } from '@o/kit'

const Theme = new ThemeMaker()

export const themes = {
  ...KitThemes,

  home: {
    ...KitThemes.dark,
    ...Theme.colorize({
      background: '#000',
      inputBackground: '#000',
      listItemBackgroundHover: 'rgba(255,255,255,0.05)',
      popoverBackground: '#111',
    }),
  },
}

console.log(themes)
