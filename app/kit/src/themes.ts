import { ThemeSet } from '@o/css'
import { linearGradient, ThemeMaker, toColor } from '@o/gloss'

const Theme = new ThemeMaker()

const orbitColor = toColor('#1A71E3')
const orbitHoverBg = orbitColor.darken(0.02).desaturate(0.3)
const orbitActiveBg = orbitHoverBg.darken(0.05).desaturate(0.3)

const colors = {
  selected: orbitColor,
  red: '#c80000',
}

const colorThemes: ThemeSet = {
  red: Theme.fromStyles({
    iconFill: '#fff',
    color: '#fff',
    background: colors.red,
    backgroundHover: colors.red,
    backgroundActive: colors.red,
  }),
  green: Theme.fromStyles({
    iconFill: '#fff',
    background: '#449878',
    color: '#fff',
  }),
  blue: Theme.fromStyles({
    iconFill: '#fff',
    background: orbitColor,
    backgroundHover: orbitColor,
    backgroundActive: orbitColor,
    listItemBackground: orbitColor.alpha(0.5),
    color: '#fff',
    borderColor: orbitActiveBg,
  }),
  transparent: Theme.colorize({
    background: 'transparent',
    backgroundHover: 'transparent',
    backgroundActive: 'transparent',
  }),
  orange: Theme.fromStyles({
    color: '#fff',
    background: '#DC6104',
  }),
}

const alternates: ThemeSet = {
  orange: colorThemes.orange,
  remove: colorThemes.red,
  confirm: {
    buttonFontWeight: 600,
    ...colorThemes.green,
  },
  action: colorThemes.blue,
  selected: colorThemes.blue,
  bordered: {
    borderWidth: 2,
    ...colorThemes.transparent,
  },
  titlebar: Theme.fromStyles({
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
  }),
}

const base = Theme.colorize({
  borderSelected: '#90b1e4ee',
  white: '#fff',
  highlightColor: '#fff',
  highlightBackground: '#4080ff', // used for text selection, tokens, etc.
  highlightBackgroundActive: '#85afee', // active tokens
})

const lightColor = '#444'
const lightBackground = toColor('#fff')
const lightButtonBg = linearGradient('#fcfcfc', '#f4f4f4')
const light = {
  alternates,
  ...base,
  cardShadow: [0, 2, 8, [0, 0, 0, 0.038]],
  cardHoverGlow: [0, 0, 0, 2, [0, 0, 0, 0.05]],
  ...Theme.fromStyles({
    background: lightBackground,
    backgroundStrong: lightBackground.darken(0.1),
    backgroundStronger: lightBackground.darken(0.2),
    backgroundStrongest: lightBackground.darken(0.3),
    backgroundZebra: '#f6f7f9aa',
    backgroundHighlightActive: orbitColor.lighten(0.1),
    backgroundHighlight: orbitColor,
    mainBackground: lightBackground,
    backgroundActive: '#eee',
    backgroundHover: '#eee',
    color: lightColor,
    colorHighlight: '#fff',
    colorHighlightActive: '#fff',
    buttonBackground: lightButtonBg,
    buttonBackgroundActive: linearGradient('#eee', '#e9e9e9'),
    buttonBackgroundFocus: lightButtonBg,
    buttonBackgroundHover: lightButtonBg.adjust(x => toColor(x).lighten(0.025)),
    borderColor: [220, 220, 220],
    borderColorActive: [220, 220, 220],
    borderColorHover: [220, 220, 220],
    borderColorLight: [215, 215, 215, 0.5],
    headerBackground: linearGradient([245, 245, 245, 0.85], [245, 245, 245, 0.95]),
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
}

const darkColor = [250, 250, 250]
const darkBackground = toColor([30, 30, 30])
const darkFadeBackground = [0, 0, 0, 0.15]
const darkButtonBg = linearGradient([66, 66, 66, 0.8], [60, 60, 60, 0.8])
const darkAlternates: ThemeSet = {
  ...alternates,
  bordered: {
    ...alternates.bordered,
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
const dark = {
  alternates: darkAlternates,
  ...base,
  cardShadow: [0, 6, 14, [0, 0, 0, 0.08]],
  cardHoverGlow: [0, 0, 0, 2, [0, 0, 0, 0.15]],
  ...Theme.fromStyles({
    backgroundZebra: darkBackground.lighten(0.3).alpha(0.5),
    backgroundStrongest: darkBackground.lighten(0.45),
    backgroundStronger: darkBackground.lighten(0.3),
    backgroundStrong: darkBackground.lighten(0.15),
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
    buttonBackgroundHover: darkButtonBg.adjust(c => toColor(c).lighten(0.1)),
    buttonBorderColor: [35, 35, 35],
    buttonBorderColorActive: [35, 35, 35],
    buttonBorderColorHover: [40, 40, 40],
    colorBlur: '#bbb',
    colorActive: '#fff',
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
    floatingBackground: [70, 70, 70],
    cardBackground: [110, 110, 110, 0.4],
    cardBackgroundHover: [110, 110, 110, 0.4],
    cardBackgroundActive: [110, 110, 110, 0.4],
    cardBorderColor: [255, 255, 255, 0.07],
    cardBorderColorHover: [255, 255, 255, 0.15],
    panelHeaderBackground: darkBackground.lighten(0.15),
    redTint: '#ff000011',
    yellowTint: '#FFCA0011',
  }),
}

export const themes: ThemeSet = {
  tooltip: Theme.fromStyles({
    background: 'rgba(20,20,20,0.94)',
    backgroundHover: 'rgba(28,28,28,0.94)',
    color: '#fff',
  }),
  dark,
  light,
}
