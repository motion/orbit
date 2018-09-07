import { ThemeMaker, color } from '@mcro/gloss'

const Theme = new ThemeMaker()

const tanBg = color('rgb(255,255,245)')
const tanHoverBg = tanBg.darken(0.02).desaturate(0.3)
const tanActiveBg = tanHoverBg.darken(0.05).desaturate(0.3)

const orbitColor = color('#3d91ff')
const orbitHoverBg = orbitColor.darken(0.02).desaturate(0.3)
const orbitActiveBg = orbitHoverBg.darken(0.05).desaturate(0.3)

const macTheme = Theme.colorize({
  shadowSelected: [0, 0, 0, 3, '#90b1e433'],
  borderSelected: '#90b1e4ee',

  white: '#fff',
  light02: '#f6f7f9', // Light 02 – Modal Headers & Nav - Modal headers and navigation elements that sit above primary UI
  light05: '#e9ebee', // Light 05 – Mobile & Desktop Wash - Background wash color for desktop and mobile
  light10: '#dddfe2', // Light 10 – Desktop Dividers, Strokes, Borders - Desktop dividers, strokes, borders
  light15: '#ced0d4', // Light 15 – Mobile Dividers, Strokes, Borders - Mobile dividers, strokes, borders
  light20: '#bec2c9', // Light 20 – Inactive Nav Glyphs - Inactive-state nav glyphs, tertiary glyphs
  light30: '#90949c', // Light 30 – Secondary Text & Glyphs - Secondary text and glyphs, meta text and glyphs
  light50: '#4b4f56', // Light 50 – Medium Text & Primary Glyphs - Medium text and primary glyphs
  light80: '#1d2129', // Light 80 – Primary Text - Primary text
  highlightBackground: '#4080ff', // used for text selection, tokens, etc.
  highlightBackgroundActive: '#85afee', // active tokens
  frameBorderColor: '#aaa',

  // sub-themes go into their own objects so they can be narrowed into
  titleBar: {
    tabBackgroundActive: 'linear-gradient(#D5D5D5, #CBCBCC)',
    tabBackground: 'linear-gradient(#BFBFBF, #B1B1B1)',
    tabBackgroundHover: 'linear-gradient(#B1B1B1, #A1A1A1)',
    background: '#eae9eb',
    backgroundBottom: '#dcdbdc',
    backgroundGradient: 'linear-gradient(#E5E4E5, #CDCDCD)',
    backgroundBlur: '#f6f6f6',
    borderColor: '#c1c0c2',
    borderBottomColor: '#B2B2B3',
    borderColorBlur: '#cecece',
    icon: '#6f6f6f',
    iconBlur: '#acacac',
    iconSelected: '#4d84f5',
    iconSelectedBlur: '#80a6f5',
    iconActive: '#4c4c4c',
    buttonBorderColor: '#d3d2d3',
    buttonBorderBottom: '#b0afb0',
    buttonBorderBlur: '#dbdbdb',
    buttonBackground: 'linear-gradient(#FDFDFD, #F3F3F3)',
    buttonBackgroundBlur: '#f6f6f6',
    buttonBackgroundActiveHighlight: '#ededed',
  },
})

export const themes = {
  orbit: Theme.fromStyles({
    background: orbitColor,
    color: '#fff',
    borderColor: orbitActiveBg,
  }),
  tooltip: {
    background: 'rgba(20,20,20,0.94)',
    color: '#fff',
  },
  dark: {
    ...macTheme,
    glintColor: [255, 255, 255, 0.2],
    listItemBackground: 'transparent',
    listItemBackgroundSelected: [60, 60, 60, 0.2],
    listItemBackgroundHover: [20, 20, 20, 0.3],
    cardBackground: [90, 90, 90, 0.35],
    cardShadow: [0, 6, 14, [0, 0, 0, 0.08]],
    cardBorderColor: [255, 255, 255, 0.07],
    ...Theme.fromStyles({
      background: [20, 20, 20, 0.94],
      backgroundHover: 'rgba(20,20,20,0.2)',
      color: '#fff',
      borderColor: '#222',
    }),
    colorActive: '#fff',
  },
  light: {
    ...macTheme,
    listItemBackground: [255, 255, 255, 0.1],
    listItemBackgroundSelected: [255, 255, 255, 0.35],
    listItemBackgroundHover: [255, 255, 255, 0.2],
    inputBackground: '#e9e9e9',
    inputBackgroundActive: '#eee',
    cardShadow: [0, 2, 6, [0, 0, 0, 0.035]],
    cardBorderColor: [0, 0, 0, 0.1],
    ...Theme.fromStyles({
      background: 'rgba(255,255,255,0.94)',
      color: '#444',
      borderColor: '#e2e2e2',
    }),
  },
  tan: {
    ...macTheme,
    ...Theme.fromStyles({
      background: tanBg,
      color: '#656141',
      borderColor: tanActiveBg,
    }),
  },
}
