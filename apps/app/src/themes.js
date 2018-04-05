import { ThemeMaker, color } from '@mcro/ui'
import * as Constants from '~/constants'

const Theme = new ThemeMaker()

const highlightColor = '#fff'
const highlightBackground = Constants.ORBIT_COLOR

const blank = {
  highlightBackground: 'transparent',
  highlightColor: 'transparent',
  background: 'transparent',
  color: '#fff',
  borderColor: 'transparent',
  buttonBackground: 'transparent',
}

const tanColor = color('rgb(255,255,245)')

const Themes = {
  light: Theme.fromStyles({
    highlightBackground,
    highlightColor,
    background: '#fff',
    color: [0, 0, 0, 0.8],
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
  gray: Theme.fromStyles({
    highlightBackground,
    highlightColor,
    background: '#eee',
    color: '#999',
    borderColor: '#eee',
  }),
  tan: Theme.fromStyles({
    highlightBackground,
    highlightColor: tanColor
      .darken(0.05)
      .desaturate(0.5)
      .toString(),
    background: tanColor.toString(),
    color: '#444',
    borderColor: '#000',
  }),
  dark: Theme.fromStyles({
    highlightBackground: [0, 0, 0, 0.05],
    highlightColor,
    background: 'rgba(20,20,20,0.94)',
    color: '#fff',
    borderColor: '#222',
  }),
  'clear-light': Theme.fromStyles({
    highlightBackground,
    highlightColor,
    background: [0, 0, 0, 0],
    color: [0, 0, 0, 0.6],
    borderColor: [0, 0, 0, 0.3],
  }),
  'clear-dark': Theme.fromStyles({
    highlightBackground,
    highlightColor,
    background: [25, 25, 25, 0],
    color: [255, 255, 255, 0.78],
    borderColor: [255, 255, 255, 0.3],
    hover: {
      background: [255, 255, 255, 0.025],
    },
  }),
}

window.Themes = Themes

export default Themes
