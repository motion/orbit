import { ThemeMaker } from '@mcro/gloss'

const Theme = new ThemeMaker()

export const themes = {
  light: Theme.fromStyles({
    background: '#fff',
    color: '#333',
  }),
  dark: Theme.fromStyles({
    background: '#111',
    color: '#fff',
  }),
  tooltip: {
    background: 'rgba(20,20,20,0.94)',
    color: '#fff',
  },
}
