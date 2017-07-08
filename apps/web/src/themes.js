// @flow
import { color, makeTheme } from '@mcro/ui'

const highlightColor = [89, 154, 244]

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

const Theme = {
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
    ...makeTheme({
      highlightColor,
      background: [255, 255, 255, 1],
      color: '#555',
      borderColor: [0, 0, 0, 0.1],
    }),
  },
  gray: makeTheme({
    highlightColor,
    background: '#eee',
    color: '#999',
    borderColor: '#eee',
  }),
  dark: makeTheme({
    highlightColor,
    background: '#222',
    color: '#eee',
    borderColor: '#333',
  }),
  'clear-dark': makeTheme({
    highlightColor,
    background: [80, 80, 80, 0.7],
    color: '#f2f2f2',
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

window.Theme = Theme

export default Theme
