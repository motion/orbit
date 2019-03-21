import { color, linearGradient, ThemeMaker } from '@o/gloss'

const Theme = new ThemeMaker()

const tanBg = color('rgb(255,255,245)')
const tanHoverBg = tanBg.darken(0.02).desaturate(0.3)
const tanActiveBg = tanHoverBg.darken(0.05).desaturate(0.3)

const orbitColor = color('#1A71E3')
const orbitHoverBg = orbitColor.darken(0.02).desaturate(0.3)
const orbitActiveBg = orbitHoverBg.darken(0.05).desaturate(0.3)

const colors = {
  selected: orbitColor,
  red: '#7B0000',
}

const macModernTheme = Theme.colorize({
  // shadowSelected: '0 0 0 2px #90b1e433', // [0, 0, 0, 2, '#90b1e433'],
  borderSelected: '#90b1e4ee',
  white: '#fff',
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

const lightColor = '#444'
const lightBackground = color('#fff')
const lightButtonBg = linearGradient('#fcfcfc', '#f4f4f4')
const light = {
  ...macModernTheme,
  ...Theme.fromStyles({
    backgroundAlt: '#f6f7f9aa',
    backgroundHighlightActive: orbitColor.lighten(0.1),
    backgroundHighlight: orbitColor,
    background: lightBackground,
    mainBackground: lightBackground,
    backgroundActive: '#eee',
    backgroundHover: '#eee',
    color,
    colorHighlight: '#fff',
    colorHighlightActive: '#fff',
    buttonBackground: lightButtonBg,
    buttonBackgroundActive: linearGradient('#eee', '#e9e9e9'),
    buttonBackgroundFocus: lightButtonBg,
    buttonBackgroundHover: lightButtonBg,
    borderColor: [215, 215, 215],
    borderColorLight: [215, 215, 215, 0.5],
    cardShadow: [0, 2, 8, [0, 0, 0, 0.038]],
    cardHoverGlow: [0, 0, 0, 2, [0, 0, 0, 0.05]],
    headerBackground: linearGradient([245, 245, 245, 0.85], [245, 245, 245, 0.85]),
    sidebarBackground: [255, 255, 255, 0.85],
    tabBackgroundTop: lightBackground.alpha(0.65),
    tabBackgroundBottom: lightBackground,
    tabBorderColor: [205, 205, 205],
    tabInactiveHover: [10, 10, 10, 0.035],
    listItemBackground: [255, 255, 255, 0],
    listItemBorderColor: 'eee',
    listItemBackgroundHover: [100, 100, 100, 0.024],
    inputBackground: '#fff',
    inputBackgroundHover: '#fff',
    inputBackgroundActive: '#fff',
    inputBorderColorActive: [215, 215, 215],
    inputBackgroundSelection: '#ddd',
    cardBackground: [255, 255, 255],
    cardBackgroundHover: [255, 255, 255],
    cardBackgroundActive: [255, 255, 255],
    cardBorderColor: [0, 0, 0, 0.1],
  }),
  selected: Theme.fromStyles({
    iconFill: '#fff',
    background: orbitColor,
    backgroundHover: orbitColor,
    backgroundActive: orbitColor,
    listItemBackground: orbitColor.alpha(0.5),
    color: '#fff',
    borderColor: orbitActiveBg,
  }),
  bordered: {
    borderWidth: 2,
    ...Theme.colorize({
      background: 'transparent',
      backgroundHover: 'transparent',
      backgroundActive: 'transparent',
      color: lightColor,
      borderColor: lightColor,
      borderColorHover: lightColor,
    }),
  },
}

const darkColor = [250, 250, 250]
const darkBackground = color([60, 60, 60])
const darkFadeBackground = [0, 0, 0, 0.15]
const darkButtonBg = linearGradient([66, 66, 66, 0.8], [60, 60, 60, 0.8])
const dark = {
  ...macModernTheme,
  ...Theme.fromStyles({
    backgroundAlt: darkBackground.lighten(0.1).alpha(0.2),
    backgroundZebra: darkBackground.lighten(0.3).alpha(0.5),
    background: darkBackground,
    backgroundHover: [20, 20, 20, 0.2],
    backgroundActive: [30, 30, 30, 0.65],
    backgroundHighlightActive: orbitColor.lighten(0.2),
    backgroundHighlight: orbitColor,
    color: darkColor,
    colorHighlight: '#fff',
    colorHighlightActive: '#fff',
    borderColor: [180, 180, 180, 0.25],
    borderColorActive: [180, 180, 180, 0.25],
    borderColorLight: [180, 180, 180, 0.15],
    sidebarBackground: [15, 15, 15, 0.52],
    sidebarBorderColor: '#444',
    headerBorderBottom: '#151515',
    headerBackground: linearGradient([0, 0, 0, 0.2], [0, 0, 0, 0.34]),
    headerBackgroundOpaque: linearGradient('#3f3f3f', '#353535'),
    orbitHeaderBackgroundEditing: linearGradient('#163278', '#192B5C'),
    headerFadeBackground: linearGradient(
      'to right',
      darkFadeBackground,
      'transparent',
      darkFadeBackground,
    ),
    buttonBackground: darkButtonBg,
    buttonBackgroundActive: [45, 45, 45, 0.8],
    buttonBackgroundHover: darkButtonBg,
    buttonBorderColor: [35, 35, 35],
    buttonBorderColorActive: [35, 35, 35],
    buttonBorderColorHover: [40, 40, 40],
    colorBlur: '#bbb',
    colorActive: '#fff',
    cardShadow: [0, 6, 14, [0, 0, 0, 0.08]],
    cardHoverGlow: [0, 0, 0, 2, [0, 0, 0, 0.15]],
    tabBackgroundTop: darkBackground.alpha(0.65),
    tabBackgroundBottom: darkBackground,
    tabBackgroundActive: darkBackground.lighten(0.2),
    tabBackgroundHover: [255, 255, 255, 0.015],
    tabInactiveHover: [0, 0, 0, 0.1],
    glintColor: [255, 255, 255, 0.135],
    inputBackground: 'transparent',
    inputBackgroundHover: 'transparent',
    inputBackgroundActive: 'transparent',
    inputBackgroundFocus: 'transparent',
    inputBackgroundSelection: '#111',
    listItemBackground: 'transparent',
    listItemBackgroundSelected: [60, 60, 60, 0.2],
    listItemBackgroundHover: [20, 20, 20, 0.13],
    cardBackground: [110, 110, 110, 0.4],
    cardBackgroundHover: [110, 110, 110, 0.4],
    cardBackgroundActive: [110, 110, 110, 0.4],
    cardBorderColor: [255, 255, 255, 0.07],
    cardBorderColorHover: [255, 255, 255, 0.15],
    panelHeaderBackground: [60, 60, 60, 0.4],
    redTint: '#ff000011',
    yellowTint: '#FFCA0011',
  }),
  selected: Theme.fromStyles({
    iconFill: '#fff',
    background: colors.selected,
    backgroundHover: colors.selected,
    backgroundActive: colors.selected,
    listItemBackground: colors.selected.alpha(0.5),
    color: '#fff',
    borderColor: orbitActiveBg,
  }),
  bordered: {
    borderWidth: 2,
    ...Theme.colorize({
      background: 'transparent',
      backgroundHover: 'transparent',
      backgroundActive: 'transparent',
      color: darkColor,
      borderColor: darkColor,
      borderColorHover: darkColor,
    }),
  },
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
      background: colors.selected,
      backgroundHover: colors.selected,
      backgroundActive: colors.selected,
      color: '#fff',
      borderColor: orbitActiveBg,
    }),
  },
  remove: {
    ...Theme.fromStyles({
      iconFill: '#fff',
      color: '#fff',
      background: colors.red,
      backgroundHover: colors.red,
      backgroundActive: colors.red,
    }),
  },
  action: {
    ...Theme.fromStyles({
      iconFill: '#fff',
      background: '#449878',
      color: '#fff',
    }),
  },
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
