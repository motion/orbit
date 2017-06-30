// @flow
import { color } from '@mcro/ui'

function darkTheme(obj) {
  return {
    hover: {
      ...obj,
      color: '#fff',
      background: color(obj.background).lighten(0.2),
      borderColor: color(obj.borderColor).lighten(0.2),
    },
    active: {
      ...obj,
      background: color(obj.background).objen(0.2),
      highlightColor: color(obj.highlightColor).lighten(0.2),
      color: '#fff',
    },
    focus: {
      ...obj,
      background: color(obj.background).lighten(0.25),
      borderColor: obj.highlightColor,
    },
    highlight: {
      color: obj.highlightColor,
    },
  }
}

const highlightColor = [89, 154, 244]

const LIGHT = {
  highlightColor,
  background: '#fff',
  color: '#555',
  borderColor: '#eee',
}

const Theme = {
  dark: {
    name: 'dark',
    ...darkTheme({
      highlightColor,
      background: '#222',
      color: '#eee',
      borderColor: '#333',
    }),
  },
  clearDark: {
    name: 'clear-dark',
    ...darkTheme({
      highlightColor,
      background: [20, 20, 20, 0.4],
      color: '#f2f2f2',
      borderColor: [120, 120, 120, 0.4],
    }),
  },
  light: {
    name: 'light',
    base: LIGHT,
    hover: {
      ...LIGHT,
      background: color(LIGHT.background).lighten(0.1),
      color: color(LIGHT.color).lighten(0.1),
    },
    active: {
      ...LIGHT,
      background: color(LIGHT.background).darken(0.1),
      color: '#000',
      borderColor: 'purple',
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
