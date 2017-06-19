// @flow
import { clr } from '~/helpers'

const LIGHT = {
  highlightColor: 'rgb(89, 154, 244)',
  background: '#fff',
  color: '#555',
  borderColor: '#eee',
}

const DARK = {
  highlightColor: 'rgb(89, 154, 244)',
  background: '#292929',
  color: '#f2f2f2',
  borderColor: [255, 255, 255, 0.06],
}

export default {
  dark: {
    base: DARK,
    hover: {
      ...DARK,
      background: clr(DARK.background).lighten(1).toString(),
      borderColor: clr(DARK.borderColor).alpha(0.2).toString(),
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
