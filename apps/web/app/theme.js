import { clr } from '~/helpers'

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
}
