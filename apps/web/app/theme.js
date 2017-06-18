// @flow
import { clr } from '~/helpers'

const LIGHT = {
  background: '#fff',
  color: '#555',
  borderColor: '#eee',
}

const DARK = {
  background: '#292929',
  color: '#f2f2f2',
  borderColor: '#444',
}

export default {
  dark: {
    base: DARK,
    hover: {
      ...DARK,
      background: clr(DARK.background).lighten(1).toString(),
    },
    active: {
      ...DARK,
      color: '#fff',
    },
    focus: {
      ...DARK,
      background: clr(DARK.background).lighten(0.25).toString(),
    },
  },
  light: {
    base: LIGHT,
    hover: {
      ...LIGHT,
      background: clr(LIGHT.background).lighten(1).toString(),
    },
    active: {
      ...LIGHT,
      color: '#000',
      borderColor: 'purple',
    },
  },
}
