import { ThemeMaker } from '@o/gloss'
// import { themes as KitThemes } from '@o/kit'

const Theme = new ThemeMaker()

export const themes = {
  // ...KitThemes,

  home: {
    // ...KitThemes.dark,
    ...Theme.colorize({
      background: '#000',
    }),
  },
}

if (module['hot']) {
  module['hot'].accept()
}

console.log(themes)
