// @flow
import { ThemeMaker } from '@mcro/ui'

const Theme = new ThemeMaker()
const highlightColor = '#fff'
const highlightBackground = 'rgb(114, 121, 167)'

const Themes = {
  light: Theme.fromStyles({
    highlightBackground,
    highlightColor,
    background: '#fff',
    color: '#222',
    borderColor: '#eee',
    buttonBackground: 'linear-gradient(#fff, #fefefe)',
  }),
  dark: Theme.fromStyles({
    highlightBackground: [0, 0, 0, 0.05],
    highlightColor,
    background: '#333',
    color: '#fff',
    borderColor: '#222',
  }),
}

window.Themes = Themes
export default Themes
