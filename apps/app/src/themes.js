import { ThemeMaker, color } from '@mcro/ui'
import * as Constants from '~/constants'

const Theme = new ThemeMaker()

const highlightColor = '#fff'
const highlightBackground = Constants.ORBIT_COLOR

const blank = {
  highlightBackground: 'transparent',
  highlightColor: 'transparent',
  background: 'transparent',
  color: '#fff',
  borderColor: 'transparent',
  buttonBackground: 'transparent',
}

const tanBg = color('rgb(255,255,245)')
const tanHoverBg = tanBg.darken(0.02).desaturate(0.3)
const tanActiveBg = tanHoverBg.darken(0.05).desaturate(0.3)
const tanActiveHoverBg = tanHoverBg.darken(0.06).desaturate(0.3)

const Themes = {
  tan: Theme.fromStyles({
    background: tanBg,
    color: '#444',
    borderColor: '#000',
    hover: {
      background: tanHoverBg,
    },
    selected: {
      background: color('#fff'),
    },
    active: {
      background: tanActiveBg,
    },
    activeHover: {
      background: tanActiveHoverBg,
    },
  }),
  dark: Theme.fromStyles({
    highlightBackground: [0, 0, 0, 0.05],
    highlightColor,
    background: 'rgba(20,20,20,0.94)',
    color: '#fff',
    borderColor: '#222',
  }),
  light: Theme.fromStyles({
    highlightBackground,
    highlightColor,
    background: '#fff',
    color: [0, 0, 0, 0.8],
    borderColor: '#eee',
    buttonBackground: 'linear-gradient(#fff, #fefefe)',
  }),
  blank: {
    base: blank,
    hover: blank,
    active: blank,
    focus: blank,
    highlight: blank,
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
    ...Theme.fromStyles({
      highlightBackground,
      highlightColor,
      background: [255, 255, 255, 1],
      color: '#555',
      borderColor: [0, 0, 0, 0.1],
    }),
  },
}

window.Themes = Themes

export default Themes
