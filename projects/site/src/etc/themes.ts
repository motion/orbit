import { ThemeMaker } from '@o/gloss'

const Theme = new ThemeMaker()
const highlightColor = '#fff'
const highlightBackground = 'rgb(114, 121, 167)'

export const themes = {
  light: Theme.fromStyles({
    highlightBackground,
    highlightColor,
    background: '#fff',
    color: '#222',
    borderColor: '#eee',
  }),
  lighter: Theme.fromStyles({
    background: '#FCF4ED',
    color: '#736255',
  }),
  medium: Theme.fromStyles({
    highlightBackground,
    highlightColor,
    background: '#f2f2f2',
    color: '#222',
    borderColor: '#eee',
  }),
  dark: Theme.fromStyles({
    highlightBackground: [0, 0, 0, 0.05],
    highlightColor,
    background: '#000',
    color: '#fff',
    borderColor: '#222',
  }),
}
