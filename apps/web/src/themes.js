// @flow
import { ThemeMaker, color } from '@mcro/ui'

const Theme = new ThemeMaker()

const highlightColor = 'rgb(95, 82, 159)'

const LIGHT = {
  highlightColor,
  background: '#fff',
  color: '#555',
  borderColor: '#eee',
  buttonBackground: 'linear-gradient(#fff, #fefefe)',
}

const blank = {
  highlightColor: 'transparent',
  background: 'transparent',
  color: '#fff',
  borderColor: 'transparent',
  buttonBackground: 'transparent',
}

const Themes = {
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
  'clear-dark': Theme.fromStyles({
    glow: {
      opacity: 1,
    },
    highlightColor,
    background: [0, 0, 0, 0],
    color: [255, 255, 255, 0.6],
    borderColor: [255, 255, 255, 0.3],
  }),
  light: {
    base: LIGHT,
    hover: {
      ...LIGHT,
      color: color(LIGHT.color).lighten(0.5),
    },
    active: {
      ...LIGHT,
      background: color(LIGHT.background).darken(0.1),
      color: '#000',
      borderColor: '#fff',
    },
    focus: {
      ...LIGHT,
    },
    highlight: {
      color: LIGHT.highlightColor,
    },
  },
}

window.Themes = Themes

export default Themes
