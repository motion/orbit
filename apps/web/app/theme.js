import { clr } from '~/helpers'

const LIGHT = {
  background: '#fff',
  color: '#555',
  borderColor: '#eee',
}

const DARK = {
  background: '#222',
  color: '#fff',
  borderColor: '#444',
}

export default {
  dark: {
    base: DARK,
    hover: {
      ...DARK,
      background: clr(DARK.background).lighten(1),
    },
    active: {
      ...DARK,
      color: '#fff',
    },
  },
  light: {
    base: LIGHT,
    hover: {
      ...LIGHT,
      background: clr(LIGHT.background).lighten(1),
    },
    active: {
      ...LIGHT,
      color: '#000',
      borderColor: 'purple',
    },
  },
}
