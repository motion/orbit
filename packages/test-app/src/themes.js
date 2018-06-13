import { ThemeMaker } from '@mcro/ui'

const Theme = new ThemeMaker()
const highlightColor = '#fff'
const highlightBackground = 'rgb(114, 121, 167)'

const Themes = {
  light: Theme.fromStyles({
    toolBarBackground: 'rgb(90.6%, 94.2%, 99.9%)',
    highlightBackground,
    highlightColor,
    background: '#fff',
    color: '#222',
    borderColor: '#eee',
  }),
  dark: Theme.fromStyles({
    highlightBackground: [0, 0, 0, 0.05],
    highlightColor,
    background: '#111',
    color: '#fff',
    borderColor: '#222',
  }),
}

export default Themes
