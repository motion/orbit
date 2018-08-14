import { ThemeMaker, color } from '@mcro/gloss'

const Theme = new ThemeMaker()

const highlightColor = '#fff'

const greyBg = color('#fff')
const greyHoverBg = greyBg.darken(0.02)
const greyActiveBg = greyHoverBg.darken(0.05)
const greyActiveHoverBg = greyHoverBg.darken(0.06)

const tanBg = color('rgb(255,255,245)')
const tanHoverBg = tanBg.darken(0.02).desaturate(0.3)
const tanActiveBg = tanHoverBg.darken(0.05).desaturate(0.3)

const orbitColor = color('#3d91ff')
const orbitHoverBg = orbitColor.darken(0.02).desaturate(0.3)
const orbitActiveBg = orbitHoverBg.darken(0.05).desaturate(0.3)

export const themes = {
  clear: {
    base: {
      background: 'transparent',
      color: '#444',
    },
    hover: {
      background: [0, 0, 0, 0.085],
      color: '#444',
    },
    active: {
      background: [0, 0, 0, 0.05],
      color: '#444',
    },
  },
  orbit: Theme.fromStyles({
    background: orbitColor,
    color: '#fff',
    borderColor: orbitActiveBg,
  }),
  grey: Theme.fromStyles({
    highlightBackground: [0, 0, 0, 0.05],
    highlightColor,
    background: greyBg,
    color: '#222',
    borderColor: greyActiveBg,
    hover: {
      background: greyHoverBg,
    },
    selected: {
      background: color('#fff'),
    },
    active: {
      background: orbitColor,
      color: '#fff',
    },
    activeHover: {
      background: greyActiveHoverBg,
    },
  }),
  tan: Theme.fromStyles({
    background: tanBg,
    color: '#656141',
    borderColor: tanActiveBg,
  }),
  dark: Theme.fromStyles({
    background: 'rgba(20,20,20,0.94)',
    color: '#fff',
    borderColor: '#222',
    card: {
      background: '#77777788',
    },
    hover: {
      background: color([255, 255, 255, 0.01]),
    },
    selected: {
      background: color([10, 10, 10]),
    },
    active: {
      background: color([255, 255, 255, 0.03]),
    },
    activeHover: {
      background: color([255, 255, 255, 0.025]),
    },
  }),
  light: Theme.fromStyles({
    background: color('#fff'),
    color: color('#444'),
    borderColor: color('#e2e2e2'),
    hover: {
      background: color('#eee'),
    },
    selected: {
      background: color('#ddd'),
    },
    active: {
      background: color('#ddd'),
    },
    activeHover: {
      background: color('#ccc'),
    },
  }),
}
