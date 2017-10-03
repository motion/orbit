// @flow
import { ThemeMaker } from '@mcro/ui'

const Theme = new ThemeMaker()
const highlightColor = '#fff'
const highlightBackground = 'rgb(114, 121, 167)'
const blank = {
  highlightBackground: 'transparent',
  highlightColor: 'transparent',
  background: 'transparent',
  color: '#fff',
  borderColor: 'transparent',
  buttonBackground: 'transparent',
}

const Themes = {
  light: Theme.fromStyles({
    highlightBackground,
    highlightColor,
    background: '#fff',
    color: '#555',
    borderColor: '#eee',
    buttonBackground: 'linear-gradient(#fff, #fefefe)',
  }),
  blank: {
    base: blank,
    hover: blank,
    active: blank,
    focus: blank,
    highlight: blank,
  },
  clear: {
    button: {
      borderTopWidth: 0,
      borderLeftWidth: 0,
      borderRightWidth: 0,
    },
    glow: {
      color: [255, 255, 255, 0.1],
    },
    ...Theme.fromStyles({
      highlightBackground,
      highlightColor,
      background: [255, 255, 255, 1],
      color: '#555',
      borderColor: [0, 0, 0, 0.1],
    }),
  },
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
