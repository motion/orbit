import { color, linearGradient, ThemeMaker } from '@mcro/gloss'

const Theme = new ThemeMaker()

const tanBg = color('rgb(255,255,245)')
const tanHoverBg = tanBg.darken(0.02).desaturate(0.3)
const tanActiveBg = tanHoverBg.darken(0.05).desaturate(0.3)

const orbitColor = color('#1A71E3')
const orbitHoverBg = orbitColor.darken(0.02).desaturate(0.3)
const orbitActiveBg = orbitHoverBg.darken(0.05).desaturate(0.3)

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
    backgroundAlternate: '#f6f7f9',
    background: lightBackground,
    backgroundActive: '#eee',
    backgroundHover: '#eee',
    color: '#444',
    borderColor: [215, 215, 215],
    cardShadow: [0, 2, 8, [0, 0, 0, 0.038]],
    cardHoverGlow: [0, 0, 0, 2, [0, 0, 0, 0.05]],
    headerBackground: linearGradient([255, 255, 255, 0.7], [255, 255, 255, 0.86]),
    sidebarBackground: [255, 255, 255, 0.85],
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
    background: orbitColor,
    backgroundHover: orbitColor,
    backgroundActive: orbitColor,
    listItemBackground: orbitColor.alpha(0.35),
    color: '#fff',
    borderColor: orbitActiveBg,
  }),
}

const darkBackground = color([60, 60, 60])
const darkFadeBackground = [0, 0, 0, 0.15]
const dark = {
  ...macModernTheme,
  ...Theme.fromStyles({
    backgroundAlternate: darkBackground.lighten(0.1),
    background: darkBackground,
    backgroundHover: [20, 20, 20, 0.2],
    backgroundActive: [30, 30, 30, 0.65],
    color: [250, 250, 250],
    borderColor: [180, 180, 180, 0.25],
    headerBackground: linearGradient([0, 0, 0, 0.3], [0, 0, 0, 0.44]),
    headerFadeBackground: linearGradient(
      'to right',
      darkFadeBackground,
      'transparent',
      darkFadeBackground,
    ),
    buttonBackground: [60, 60, 60, 0.8],
    buttonBackgroundActive: [45, 45, 45, 0.8],
    buttonBackgroundHover: [70, 70, 70, 0.8],
    buttonBorderColor: [35, 35, 35],
    buttonBorderColorHover: [40, 40, 40],
    colorBlur: '#bbb',
    colorActive: '#fff',
    cardShadow: [0, 6, 14, [0, 0, 0, 0.08]],
    cardHoverGlow: [0, 0, 0, 2, [0, 0, 0, 0.15]],
    tabBackgroundTop: darkBackground.alpha(0.85),
    tabBackgroundBottom: darkBackground,
    tabBackgroundActive: darkBackground.lighten(0.2),
    tabBackgroundHover: [255, 255, 255, 0.015],
    tabInactiveHover: [0, 0, 0, 0.2],
    sidebarBackground: [22, 22, 22, 0.58],
    sidebarBorderColor: '#444',
    glintColor: [255, 255, 255, 0.135],
    inputBackground: [100, 100, 100, 0.5],
    inputBorderColor: 'transparent',
    inputBackgroundHover: [110, 110, 110, 0.5],
    inputBackgroundActive: [90, 90, 90, 0.5],
    inputBackgroundFocus: [90, 90, 90, 0.5],
    listItemBackground: 'transparent',
    listItemBackgroundSelected: [60, 60, 60, 0.2],
    listItemBackgroundHover: [20, 20, 20, 0.13],
    cardBackground: [110, 110, 110, 0.4],
    cardBorderColor: [255, 255, 255, 0.07],
    cardBorderColorHover: [255, 255, 255, 0.15],
  }),
  selected: Theme.fromStyles({
    iconFill: '#fff',
    background: '#35335399',
    backgroundHover: '#555',
    backgroundActive: '#444',
    color: '#fff',
    borderColor: orbitActiveBg,
  }),
}

const clearLight = {
  ...light,
  ...Theme.fromStyles({
    color: '#fff',
    background: 'rgba(255,255,255,0)',
  }),
}

const clearDark = {
  ...dark,
  ...Theme.colorize({
    background: [19, 19, 19, 0.05],
    // cardHoverGlow: [0, 0, 0, 2, [255, 255, 255, 0.15]],
    // cardBackground: [65, 65, 65, 0.5],
  }),
}

const semiDark = {
  ...dark,
  background: 'linear-gradient(rgba(45,45,45,0.15), rgba(30,30,30,0.15))',
  backgroundHover: 'linear-gradient(rgba(45,45,45,0.1), rgba(30,30,30,0.1))',
}

export const themes = {
  selected: {
    ...Theme.fromStyles({
      iconFill: '#fff',
      background: orbitColor,
      backgroundHover: orbitColor,
      backgroundActive: orbitColor,
      color: '#fff',
      borderColor: orbitActiveBg,
    }),
  },
  // 'light-selected': {
  //   ...Theme.fromStyles({
  //     background: [0, 0, 0, 0.015],
  //     backgroundHover: [0, 0, 0, 0.015],
  //     backgroundActive: [0, 0, 0, 0.015],
  //     color: light.color,
  //     borderColor: orbitActiveBg,
  //   }),
  // },
  // 'dark-selected': {
  //   ...Theme.fromStyles({
  //     background: [255, 255, 255, 0.05],
  //     backgroundHover: [255, 255, 255, 0.05],
  //     backgroundActive: [255, 255, 255, 0.05],
  //     color: dark.color,
  //     borderColor: orbitActiveBg,
  //   }),
  // },
  tooltip: {
    background: 'rgba(20,20,20,0.94)',
    backgroundHover: 'rgba(28,28,28,0.94)',
    color: '#fff',
  },
  dark,
  clearDark,
  light,
  clearLight,
  'semi-dark': semiDark,
  tan: {
    ...macModernTheme,
    ...Theme.fromStyles({
      background: tanBg,
      color: '#656141',
      borderColor: tanActiveBg,
    }),
  },
}

// more traditional osx theme
// const macTheme = Theme.colorize({
//   shadowSelected: [0, 0, 0, 3, '#90b1e433'],
//   borderSelected: '#90b1e4ee',

//   white: '#fff',
//   light02: '#f6f7f9', // Light 02 – Modal Headers & Nav - Modal headers and navigation elements that sit above primary UI
//   light05: '#e9ebee', // Light 05 – Mobile & Desktop Wash - Background wash color for desktop and mobile
//   light10: '#dddfe2', // Light 10 – Desktop Dividers, Strokes, Borders - Desktop dividers, strokes, borders
//   light15: '#ced0d4', // Light 15 – Mobile Dividers, Strokes, Borders - Mobile dividers, strokes, borders
//   light20: '#bec2c9', // Light 20 – Inactive Nav Glyphs - Inactive-state nav glyphs, tertiary glyphs
//   light30: '#90949c', // Light 30 – Secondary Text & Glyphs - Secondary text and glyphs, meta text and glyphs
//   light50: '#4b4f56', // Light 50 – Medium Text & Primary Glyphs - Medium text and primary glyphs
//   light80: '#1d2129', // Light 80 – Primary Text - Primary text
//   highlightBackground: '#4080ff', // used for text selection, tokens, etc.
//   highlightBackgroundActive: '#85afee', // active tokens
//   frameBorderColor: '#aaa',

//   sidebarBackground: '#E8E7E7',

//   // sub-themes go into their own objects so they can be narrowed into
//   titleBar: {
//     tabBackgroundActive: 'linear-gradient(#D5D5D5, #CBCBCC)',
//     tabBackground: 'linear-gradient(#BFBFBF, #B1B1B1)',
//     tabBackgroundHover: 'linear-gradient(#B1B1B1, #A1A1A1)',
//     background: '#eae9eb',
//     backgroundBottom: '#dcdbdc',
//     backgroundGradient: 'linear-gradient(#E5E4E5, #CDCDCD)',
//     backgroundBlur: '#f6f6f6',
//     borderColor: '#c1c0c2',
//     borderBottomColor: '#B2B2B3',
//     borderColorBlur: '#cecece',
//     icon: '#6f6f6f',
//     iconBlur: '#acacac',
//     iconSelected: '#4d84f5',
//     iconSelectedBlur: '#80a6f5',
//     iconActive: '#4c4c4c',
//     buttonBorderColor: '#d3d2d3',
//     buttonBorderBottom: '#b0afb0',
//     buttonBorderBlur: '#dbdbdb',
//     buttonBackground: 'linear-gradient(#FDFDFD, #F3F3F3)',
//     buttonBackgroundBlur: '#f6f6f6',
//     buttonBackgroundActiveHighlight: '#ededed',
//   },
// })
