import { ThemeSet } from '@o/css'
import { linearGradient, ThemeMaker, toColor } from '@o/gloss'

const Theme = new ThemeMaker()

const orbitColor = toColor('#3E7FD5')
const orbitHoverBg = orbitColor.darken(0.02).desaturate(0.3)
const orbitActiveBg = orbitHoverBg.darken(0.05).desaturate(0.3)

const colors = {
  orange: '#DC6104',
  lightOrange: '#F6B585',
  darkOrange: '#9F4604',
  blue: '#3E7FD5',
  darkBlue: '#0E3D7B',
  lightBlue: '#B0C6E3',
  red: '#c80000',
  lightRed: '#FFB0B0',
  darkRed: '#A12727',
  green: '#37D55A',
  lightGreen: '#B7EFC3',
  darkGreen: '#1C8F3D',
  yellow: '#E2EB53',
  lightYellow: '#EFE5B7',
  darkYellow: '#8F7B1C',
}

const transparent = [0, 0, 0, 0]

const colorThemes: ThemeSet = {
  lightRed: Theme.fromStyles({
    glintColorBottom: transparent,
    glintColor: [255, 255, 255, 0.25],
    color: colors.darkRed,
    background: colors.lightRed,
    iconColor: colors.darkRed,
  }),
  lightGreen: Theme.fromStyles({
    glintColorBottom: transparent,
    glintColor: [255, 255, 255, 0.25],
    color: colors.darkGreen,
    iconColor: colors.darkGreen,
    background: colors.lightGreen,
  }),
  lightYellow: Theme.fromStyles({
    glintColor: [255, 255, 255, 0.25],
    color: colors.darkYellow,
    iconColor: colors.darkYellow,
    background: colors.lightYellow,
  }),
  lightBlue: Theme.fromStyles({
    glintColor: [255, 255, 255, 0.25],
    color: colors.darkBlue,
    iconColor: colors.darkBlue,
    background: colors.lightBlue,
  }),
  lightOrange: Theme.fromStyles({
    glintColor: [255, 255, 255, 0.25],
    color: colors.darkOrange,
    iconColor: colors.darkOrange,
    background: colors.lightOrange,
  }),
  red: Theme.fromStyles({
    glintColor: [255, 255, 255, 0.25],
    color: '#fff',
    iconColor: '#fff',
    background: colors.red,
    backgroundHover: colors.red,
    backgroundActive: colors.red,
  }),
  green: Theme.fromStyles({
    glintColor: [255, 255, 255, 0.25],
    iconColor: '#fff',
    background: '#449878',
    color: '#fff',
  }),
  orange: Theme.fromStyles({
    glintColor: [255, 255, 255, 0.25],
    color: '#fff',
    background: '#DC6104',
  }),
  yellow: Theme.fromStyles({
    glintColor: [255, 255, 255, 0.25],
    color: '#fff',
    background: '#C9C825',
  }),
  blue: Theme.fromStyles({
    glintColor: [255, 255, 255, 0.25],
    background: orbitColor,
    backgroundHover: orbitColor,
    backgroundActive: orbitColor,
    color: '#fff',
    borderColor: orbitActiveBg,
  }),
  transparent: Theme.colorize({
    background: transparent,
    backgroundHover: transparent,
    backgroundActive: transparent,
  }),
}

const alternates: ThemeSet = {
  ...colorThemes,
  error: colorThemes.lightRed,
  fail: colorThemes.lightRed,
  failure: colorThemes.lightRed,
  warn: colorThemes.lightYellow,
  approve: colorThemes.lightGreen,
  success: colorThemes.lightGreen,
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
  // TODO clear and flat alternates should take parent theme as a function arg
  // and then they can modify and return it
  // for example, flat should take a lightbackground and darken a bit, and dark vice-versa
  clear: Theme.fromStyles({
    background: 'rgba(0,0,0,0.2)',
    borderColor: 'rgba(0,0,0,0)',
    borderWidth: 0,
  }),
  flat: {
    glintColor: transparent,
    glintColorBottom: transparent,
    buttonGlintColor: transparent,
    buttonGlintColorBottom: transparent,
    ...Theme.colorize({
      borderColor: 'rgba(0,0,0,0)',
      borderWidth: 0,
    }),
  },
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
const lightButtonBg = linearGradient('#FCFCFC', '#F5F5F6')
const light = {
  alternates,
  ...base,
  cardShadow: [0, 2, 8, [0, 0, 0, 0.038]],
  cardHoverGlow: [0, 0, 0, 2, [0, 0, 0, 0.05]],
  ...Theme.fromStyles({
    glintColor: [255, 255, 255, 0.85],
    background: lightBackground,
    backgroundStrong: lightBackground.darken(0.025),
    backgroundStronger: lightBackground.darken(0.05),
    backgroundStrongest: lightBackground.darken(0.075),
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
    buttonGlintColorBottom: [0, 0, 0, 0.08],
    borderColor: [230, 230, 230],
    borderColorActive: [230, 230, 230],
    borderColorHover: [230, 230, 230],
    borderColorLight: [215, 215, 215, 0.5],
    headerBackground: linearGradient([245, 245, 245, 0.85], [245, 245, 245, 0.95]),
    sidebarBackground: '#f5f7f9',
    sidebarBackgroundTransparent: [255, 255, 255, 0.8],
    tabBackgroundTop: lightBackground.alpha(0.65),
    tabBackgroundBottom: lightBackground,
    tabBorderColor: [205, 205, 205],
    tabInactiveHover: [10, 10, 10, 0.035],
    listItemBackground: [255, 255, 255, 0],
    listItemBorderColor: '#eee',
    listItemBackgroundHover: [100, 100, 100, 0.024],
    listItemBackgroundActive: [100, 100, 100, 0.05],
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

const darkAltLight: ThemeSet = Object.keys(alternates).reduce((acc, key) => {
  // for dark theme, make "light" themes translucent
  if (key.indexOf('light') === 0) {
    acc[key] = Theme.fromStyles({
      background: alternates[key].background.alpha(0.25),
      borderColor: alternates[key].borderColor.alpha(0.3),
      color: '#fff',
    })
  }
  return acc
}, {})

const darkAlternates: ThemeSet = {
  ...alternates,
  ...darkAltLight,
  error: darkAltLight.lightRed,
  warn: darkAltLight.lightYellow,
  approve: darkAltLight.lightGreen,
  success: darkAltLight.lightGreen,
  bordered: {
    ...alternates.bordered,
    ...Theme.colorize({
      background: transparent,
      backgroundHover: transparent,
      backgroundActive: transparent,
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
    sidebarBackground: [15, 15, 15],
    sidebarBackgroundTransparent: [15, 15, 15, 0.2],
    sidebarBorderColor: '#444',
    headerBorderBottom: '#151515',
    headerBackground: linearGradient([0, 0, 0, 0.2], [0, 0, 0, 0.34]),
    headerBackgroundOpaque: linearGradient('#3f3f3f', '#353535'),
    orbitHeaderBackgroundEditing: linearGradient('#163278', '#192B5C'),
    headerFadeBackground: linearGradient(
      'to right',
      darkFadeBackground,
      transparent,
      darkFadeBackground,
    ),
    buttonBackground: darkButtonBg,
    buttonBackgroundActive: [45, 45, 45, 0.8],
    buttonBackgroundHover: darkButtonBg.adjust(c => toColor(c).lighten(0.1)),
    buttonBorderColor: [35, 35, 35],
    buttonBorderColorActive: [35, 35, 35],
    buttonBorderColorHover: [40, 40, 40],
    buttonGlintColorBottom: [0, 0, 0, 0.3],
    colorBlur: '#bbb',
    colorActive: '#fff',
    tabBackgroundTop: darkBackground.alpha(0.65),
    tabBackgroundBottom: darkBackground,
    tabBackgroundActive: darkBackground.lighten(0.2),
    tabBackgroundHover: [255, 255, 255, 0.015],
    tabInactiveHover: [0, 0, 0, 0.1],
    glintColor: [255, 255, 255, 0.135],
    inputBackground: transparent,
    inputBackgroundHover: transparent,
    inputBackgroundActive: transparent,
    inputBackgroundFocus: transparent,
    inputBackgroundSelection: '#111',
    listItemBackground: transparent,
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
  ...alternates,
  tooltip: Theme.fromStyles({
    background: 'rgba(20,20,20,0.94)',
    backgroundHover: 'rgba(28,28,28,0.94)',
    color: '#fff',
  }),
  dark,
  light,
}
