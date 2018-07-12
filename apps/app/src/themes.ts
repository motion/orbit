import { ThemeMaker, color } from '@mcro/ui'

const Theme = new ThemeMaker()

const highlightColor = '#fff'

const greyBg = color('#f2f2f2')
const greyHoverBg = greyBg.darken(0.02)
const greyActiveBg = greyHoverBg.darken(0.05)
const greyActiveHoverBg = greyHoverBg.darken(0.06)

const tanBg = color('rgb(255,255,245)')
const tanHoverBg = tanBg.darken(0.02).desaturate(0.3)
const tanActiveBg = tanHoverBg.darken(0.05).desaturate(0.3)
const tanActiveHoverBg = tanHoverBg.darken(0.06).desaturate(0.3)

const dbBg = color('rgb(11, 60, 117)')
const dbHoverBg = dbBg.darken(0.02).desaturate(0.3)
const dbActiveBg = dbHoverBg.darken(0.05).desaturate(0.3)
const dbActiveHoverBg = dbHoverBg.darken(0.06).desaturate(0.3)

const Themes = {
  clear: {
    base: {
      background: 'transparent',
      color: '#444',
    },
    hover: {
      background: [0, 0, 0, 0.05],
      color: '#444',
    },
    active: {
      background: [0, 0, 0, 0.05],
      color: '#444',
    },
  },
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
      background: greyActiveBg,
    },
    activeHover: {
      background: greyActiveHoverBg,
    },
  }),
  tan: Theme.fromStyles({
    highlightBackground: [0, 0, 0, 0.05],
    highlightColor,
    background: tanBg,
    color: '#656141',
    borderColor: tanActiveBg,
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
  darkBlue: Theme.fromStyles({
    highlightBackground: [0, 0, 0, 0.05],
    highlightColor,
    background: dbBg,
    color: '#fff',
    borderColor: dbActiveBg,
    hover: {
      background: dbHoverBg,
    },
    selected: {
      background: color('#fff'),
    },
    active: {
      background: dbActiveBg,
    },
    activeHover: {
      background: dbActiveHoverBg,
    },
  }),
  dark: Theme.fromStyles({
    highlightBackground: [0, 0, 0, 0.05],
    highlightColor,
    background: 'rgba(20,20,20,0.94)',
    color: '#fff',
    borderColor: '#222',
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
    highlightBackground: [0, 0, 0, 0.05],
    highlightColor,
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

window.Themes = Themes

export default Themes
