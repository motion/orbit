import { color, linearGradient, ThemeMaker } from '@mcro/gloss'

const Theme = new ThemeMaker()

const macModernTheme = Theme.colorize({
  // shadowSelected: '0 0 0 2px #90b1e433', // [0, 0, 0, 2, '#90b1e433'],
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
  highlightColor: '#fff',
  highlightBackground: '#4080ff', // used for text selection, tokens, etc.
  highlightBackgroundActive: '#85afee', // active tokens
  frameBorderColor: '#aaa',

  // sub-themes go into their own objects so they can be narrowed into
  titleBar: {
    tabBackgroundActive: '#E8E8E8',
    tabBackground: '#dfdfdf',
    tabBackgroundHover: '#bfbfbf',
    background: '#efefef',
    backgroundBottom: '#e2e2e2',
    backgroundBlur: '#f6f6f6',
    borderColor: '#ccc',
    borderColorActive: '#bbb',
    borderBottomColor: '#ccc',
    borderColorBlur: '#cecece',
    icon: '#6f6f6f',
    iconBlur: '#acacac',
    iconSelected: '#4d84f5',
    // backgroundGradient: 'linear-gradient(#efefef, #e2e2e2)',
    // buttonBackground: 'linear-gradient(#FDFDFD, #F3F3F3)',
    iconSelectedBlur: '#80a6f5',
    iconActive: '#4c4c4c',
    buttonBorderColor: '#d3d2d3',
    buttonBorderBottom: '#b0afb0',
    buttonBorderBlur: '#dbdbdb',
    buttonBackgroundBlur: '#f6f6f6',
    buttonBackgroundActiveHighlight: '#ededed',
  },
})

const lightBackground = color('#fff')
const light = {
  ...macModernTheme,
  ...Theme.fromStyles({
    backgroundAlternate: '#f6f7f9aa',
    background: lightBackground,
    mainBackground: lightBackground,
    backgroundActive: '#eee',
    backgroundHover: '#eee',
    color: '#444',
    borderColor: [215, 215, 215],
    cardShadow: [0, 2, 8, [0, 0, 0, 0.038]],
    cardHoverGlow: [0, 0, 0, 2, [0, 0, 0, 0.05]],
    headerBackground: linearGradient([245, 245, 245, 0.85], [245, 245, 245, 0.85]),
    sidebarBackground: [200, 200, 200, 0.05],
    tabBackgroundTop: lightBackground.alpha(0.65),
    tabBackgroundBottom: lightBackground,
    tabBorderColor: [205, 205, 205],
    tabInactiveHover: [10, 10, 10, 0.035],
    buttonBackground: '#f2f2f2',
    listItemBackground: [255, 255, 255, 0],
    listItemBorderColor: 'eee',
    listItemBackgroundHover: [100, 100, 100, 0.024],
    inputBackground: '#f2f2f2',
    inputHover: '#f2f2f2',
    inputActive: '#f2f2f2',
    inputBackgroundActive: [0, 0, 0, 0.1],
    cardBackground: [250, 250, 250],
    cardBorderColor: [0, 0, 0, 0.1],
  }),
  selected: Theme.fromStyles({
    iconFill: '#fff',
    background: 'blue',
    backgroundHover: 'blue',
    backgroundActive: 'blue',
    listItemBackground: 'blue',
    color: '#fff',
    borderColor: 'darkblue',
  }),
}

export const themes = {
  light,
  dark: Theme.fromStyles({
    background: '#111',
    color: '#fff',
  }),
  tooltip: {
    background: 'rgba(20,20,20,0.94)',
    color: '#fff',
  },
}
