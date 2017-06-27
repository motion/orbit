// @flow
import { color } from '@jot/ui'

const LIGHT = {
  highlightColor: 'rgb(89, 154, 244)',
  background: '#fff',
  color: '#555',
  borderColor: '#eee',
}

const DARK = {
  highlightColor: 'rgb(89, 154, 244)',
  background: '#333',
  color: '#f2f2f2',
  borderColor: [40, 40, 40, 0.9],
}

const Theme = {
  dark: {
    name: 'dark',
    base: DARK,
    hover: {
      ...DARK,
      color: color(DARK.color).lighten(0.2),
      background: color(DARK.background).lighten(0.2),
      borderColor: color(DARK.borderColor).lighten(0.2),
    },
    active: {
      ...DARK,
      highlightColor: color(DARK.highlightColor).lighten(0.2),
      color: '#fff',
    },
    focus: {
      ...DARK,
      background: color(DARK.background).lighten(0.25),
      borderColor: DARK.highlightColor,
    },
    highlight: {
      color: DARK.highlightColor,
    },
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
