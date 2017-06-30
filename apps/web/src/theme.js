// @flow
import { color } from '@mcro/ui'

const LIGHT = {
  highlightColor: 'rgb(89, 154, 244)',
  background: '#fff',
  color: '#555',
  borderColor: '#eee',
}

const DARK = {
  highlightColor: 'rgb(89, 154, 244)',
  background: [20, 20, 20, 0.4],
  color: '#f2f2f2',
  borderColor: [120, 120, 120, 0.4],
}

const Theme = {
  dark: {
    name: 'dark',
    base: DARK,
    hover: {
      ...DARK,
      color: '#fff',
      background: color(DARK.background).lighten(0.2),
      borderColor: color(DARK.borderColor).lighten(0.2),
    },
    active: {
      ...DARK,
      background: color(DARK.background).darken(0.2),
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
