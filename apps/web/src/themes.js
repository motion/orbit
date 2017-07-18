// @flow
import { ThemeMaker, color } from '@mcro/ui'

const Theme = new ThemeMaker()

const highlightColor = 'rgb(95, 82, 159)'

const blank = {
  highlightColor: 'transparent',
  background: 'transparent',
  color: '#fff',
  borderColor: 'transparent',
  buttonBackground: 'transparent',
}

const Themes = {
  light: Theme.fromStyles({
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
      highlightColor,
      background: [255, 255, 255, 1],
      color: '#555',
      borderColor: [0, 0, 0, 0.1],
    }),
  },
  gray: Theme.fromStyles({
    highlightColor,
    background: '#eee',
    color: '#999',
    borderColor: '#eee',
  }),
  dark: Theme.fromStyles({
    highlightColor,
    background: '#333',
    color: '#fff',
    borderColor: '#222',
  }),
  'clear-light': Theme.fromStyles({
    highlightColor,
    background: [0, 0, 0, 0],
    color: [0, 0, 0, 0.6],
    borderColor: [0, 0, 0, 0.3],
  }),
  'clear-dark': Theme.fromStyles({
    glint: {
      opacity: 0,
    },
    glow: {
      opacity: 1,
    },
    highlightColor,
    background: [25, 25, 25, 0.4],
    color: [255, 255, 255, 0.78],
    borderColor: [255, 255, 255, 0.3],
  }),
}

window.Themes = Themes

export default Themes
