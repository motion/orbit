// @flow
import { color } from '@jot/black'

const LIGHT = {
  highlightColor: 'rgb(89, 154, 244)',
  background: '#fff',
  color: '#555',
  borderColor: '#eee',
}

const DARK = {
  highlightColor: 'rgb(89, 154, 244)',
  background: '#222',
  color: '#f2f2f2',
  borderColor: [255, 255, 255, 0.06],
}

const Theme = {
  dark: {
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
    base: LIGHT,
    hover: {
      ...LIGHT,
      background: color(LIGHT.background).lighten(1),
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
