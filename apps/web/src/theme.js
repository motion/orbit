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
      color: color(DARK.color).lighten(2).toString(),
      background: color(DARK.background).lighten(1).toString(),
      borderColor: color(DARK.borderColor).alpha(0.2).toString(),
    },
    active: {
      ...DARK,
      highlightColor: color(DARK.highlightColor).lighten(1).toString(),
      color: '#fff',
    },
    focus: {
      ...DARK,
      background: color(DARK.background).lighten(0.25).toString(),
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
      background: color(LIGHT.background).lighten(1).toString(),
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
