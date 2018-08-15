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

const macTheme = {
  highlight: '#dbe7fa', // used for text selection, tokens, etc.
  highlightActive: '#85afee', // active tokens
  titleBar: {
    backgroundTop: '#eae9eb',
    backgroundBottom: '#dcdbdc',
    background: 'linear-gradient(to bottom, #eae9eb 0%, #dcdbdc 100%)',
    backgroundBlur: '#f6f6f6',
    borderColor: '#c1c0c2',
    borderColorBlur: '#cecece',
    icon: '#6f6f6f',
    iconBlur: '#acacac',
    iconSelected: '#4d84f5',
    iconSelectedBlur: '#80a6f5',
    iconActive: '#4c4c4c',
    buttonBorder: '#d3d2d3',
    buttonBorderBottom: '#b0afb0',
    buttonBorderBlur: '#dbdbdb',
    buttonBackground: 'rgba(0,0,0,0.05)',
    buttonBackgroundBlur: '#f6f6f6',
    buttonBackgroundActiveHighlight: '#ededed',
    buttonBackgroundActive: '#e5e5e5',
  },
  sidebar: {
    sectionTitle: '#777',
    sectionItem: '#434343',
    panelSeperator: '#b3b3b3',
  },
}

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
  grey: {
    ...macTheme,
    ...Theme.fromStyles({
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
  },
  tan: Theme.fromStyles({
    background: tanBg,
    color: '#656141',
    borderColor: tanActiveBg,
  }),
  dark: {
    ...macTheme,
    card: {
      background: '#77777788',
    },
    ...Theme.fromStyles({
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
  },
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
