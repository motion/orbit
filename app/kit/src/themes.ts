import { linearGradient, toColor } from '@o/color'
import { ThemeObject, ThemeSet } from '@o/css'
import { colorize, fromStyles } from 'gloss-theme'

export const colors = colorize({
  orange: '#E97902',
  lightOrange: '#F6B585',
  darkOrange: '#9F4604',
  blue: 'rgb(116, 162, 230)',
  darkBlue: '#0E3D7B',
  lightBlue: '#CBDFFA',
  red: '#c80000',
  lightRed: '#FFB0B0',
  darkRed: '#A12727',
  green: '#37D55A',
  lightGreen: '#B7EFC3',
  darkGreen: '#1C8F3D',
  yellow: '#E2EB53',
  lightYellow: '#EFE5B7',
  darkYellow: '#8F7B1C',
  gray: 'rgba(125, 125, 125, 0.5)',
})

const transparent = [0, 0, 0, 0]

const colorThemes: ThemeSet = {
  // light
  lightRed: fromStyles({
    glintColorBottom: transparent,
    glintColor: [255, 255, 255, 0.25],
    color: colors.darkRed,
    background: colors.lightRed,
    iconColor: colors.darkRed,
  }),
  lightGreen: fromStyles({
    glintColorBottom: transparent,
    glintColor: [255, 255, 255, 0.25],
    color: colors.darkGreen,
    iconColor: colors.darkGreen,
    background: colors.lightGreen,
  }),
  lightYellow: fromStyles({
    glintColor: [255, 255, 255, 0.25],
    color: colors.darkYellow,
    iconColor: colors.darkYellow,
    background: colors.lightYellow,
  }),
  lightBlue: fromStyles({
    glintColor: [255, 255, 255, 0.25],
    color: colors.darkBlue,
    iconColor: colors.darkBlue,
    background: colors.lightBlue,
  }),
  lightOrange: fromStyles({
    glintColor: [255, 255, 255, 0.25],
    color: colors.darkOrange,
    iconColor: colors.darkOrange,
    background: colors.lightOrange,
  }),
  // regular
  red: fromStyles({
    glintColor: [255, 255, 255, 0.25],
    color: '#fff',
    iconColor: '#fff',
    background: colors.red,
    backgroundHover: colors.red,
    backgroundActive: colors.red,
  }),
  green: fromStyles({
    glintColor: [255, 255, 255, 0.25],
    iconColor: '#fff',
    background: '#449878',
    color: '#fff',
  }),
  orange: fromStyles({
    glintColor: [255, 255, 255, 0.25],
    color: '#fff',
    background: colors.orange,
  }),
  yellow: fromStyles({
    glintColor: [255, 255, 255, 0.25],
    color: '#fff',
    background: colors.yellow,
  }),
  blue: fromStyles({
    glintColor: [255, 255, 255, 0.25],
    background: colors.blue,
    color: '#fff',
  }),
  transparent: colorize({
    background: transparent,
    backgroundHover: transparent,
    backgroundActive: transparent,
  }),
  // chromeless (just foreground color)
  simpleBlue: fromStyles({
    glintColorBottom: transparent,
    glintColor: transparent,
    background: transparent,
    color: colors.blue,
  }),
  simpleYellow: fromStyles({
    glintColorBottom: transparent,
    glintColor: transparent,
    background: transparent,
    color: colors.yellow,
  }),
  simpleOrange: fromStyles({
    glintColorBottom: transparent,
    glintColor: transparent,
    background: transparent,
    color: colors.orange,
  }),
  simpleGreen: fromStyles({
    glintColorBottom: transparent,
    glintColor: transparent,
    background: transparent,
    color: colors.green,
  }),
  simpleRed: fromStyles({
    glintColorBottom: transparent,
    glintColor: transparent,
    background: transparent,
    color: colors.red,
  }),
  simpleGray: fromStyles({
    glintColorBottom: transparent,
    glintColor: transparent,
    background: transparent,
    color: colors.gray,
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
  selected: {
    ...colorThemes.blue,
    // dont make selected things hover/active, they're active already
    backgroundHover: colorThemes.blue.background,
    backgroundActive: colorThemes.blue.background,
  },
  selectedInactive: parent => ({
    ...colorThemes.blue,
    ...colorize({
      // dont make selected things hover/active, they're active already
      background: [150, 150, 150, 0.1],
      backgroundHover: [150, 150, 150, 0.1],
      backgroundActive: [150, 150, 150, 0.1],
    }),
    borderColor: parent.borderColor,
    color: parent.color,
  }),
  bordered: {
    glintColor: transparent,
    borderWidth: 2,
    ...colorThemes.transparent,
  },
  titlebar: fromStyles({
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
  clear: parent =>
    fromStyles({
      glintColor: transparent,
      color: parent.color,
      background: parent.background.isDark()
        ? parent.background.lighten(0.1).alpha(0.15)
        : parent.background.darken(0.1).alpha(0.15),
      borderColor: transparent,
      borderWidth: 0,
    }),
  flat: parent => {
    const background = parent.background.isDark()
      ? parent.background.lighten(0.08).alpha(0.5)
      : parent.background.darken(0.05).alpha(0.5)

    console.log('ok123123', background, background.alpha(1))

    return {
      color: parent.color,
      background,
      backgroundHover: background.darken(0.1).alpha(0.8),
      backgroundFocus: background.darken(0.1).alpha(0.8),
      backgroundActive: background.darken(0.1).alpha(0.8),
      glintColor: transparent,
      glintColorBottom: transparent,
      ...colorize({
        borderColor: transparent,
        borderWidth: 0,
      }),
    }
  },
}

const base = colorize({
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
  ...fromStyles({
    glintColor: [255, 255, 255, 0.85],
    background: lightBackground,
    backgroundStrong: lightBackground.darken(0.025),
    backgroundStronger: lightBackground.darken(0.05),
    backgroundStrongest: lightBackground.darken(0.075),
    backgroundZebra: '#f6f7f9aa',
    backgroundHighlightActive: colors.blue.lighten(0.1),
    backgroundHighlight: colors.blue,
    mainBackground: lightBackground,
    backgroundActive: '#eee',
    backgroundHover: '#eee',
    color: lightColor,
    colorHighlight: '#fff',
    colorHighlightActive: '#fff',
    buttonBackground: lightButtonBg,
    buttonBackgroundActive: linearGradient('#eee', '#e9e9e9'),
    // buttonBackgroundFocus: lightButtonBg,
    buttonBackgroundHover: lightButtonBg.adjust(x => toColor(x).lighten(0.025)),
    buttonGlintColorBottom: [0, 0, 0, 0.08],
    borderColor: [230, 230, 230],
    borderColorActive: [230, 230, 230],
    borderColorHover: [230, 230, 230],
    borderColorLight: [215, 215, 215, 0.5],
    headerBackground: linearGradient([245, 245, 245, 0.85], [245, 245, 245, 0.95]),
    sidebarBackground: '#f5f7f9',
    sidebarBackgroundTransparent: [255, 255, 255, 0.8],
    tabBackgroundHover: [0, 0, 0, 0.1],
    tabBackgroundActive: [0, 0, 0, 0.15],
    tabBackgroundSelected: lightBackground,
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
    orbitHeaderBackgroundEditing: linearGradient('#163278', '#192B5C'),
    orbitInputBackgroundEditing: [0, 0, 0, 0.2],
  }),
}

const darkColor = [255, 255, 255]
const darkBackground = toColor([30, 30, 30])
const darkFadeBackground = [0, 0, 0, 0.15]
const darkButtonBg = linearGradient([77, 77, 77], [70, 70, 70])

const darkAltLight: ThemeSet = Object.keys(alternates).reduce((acc, key) => {
  // for dark theme, make "light" themes translucent
  if (key.indexOf('light') === 0) {
    acc[key] = fromStyles({
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
    ...colorize({
      background: transparent,
      backgroundHover: transparent,
      backgroundActive: transparent,
      color: darkColor,
      borderColor: [...darkColor, 0.2],
      borderColorHover: [...darkColor, 0.3],
    }),
  },
}

let dark: ThemeObject = {
  alternates: darkAlternates,
  ...base,
  backgroundZebra: darkBackground.lighten(0.2).alpha(0.35),
  backgroundZebraHover: darkBackground.lighten(0.4).alpha(0.35),
  backgroundStrongest: darkBackground.lighten(0.45),
  backgroundStronger: darkBackground.lighten(0.3),
  backgroundStrong: darkBackground.lighten(0.15),
  background: darkBackground,
  ...fromStyles({
    background: darkBackground,
    backgroundHover: [20, 20, 20, 0.2],
    backgroundActive: [30, 30, 30, 0.65],
    backgroundHighlightActive: colors.blue.lighten(0.2),
    backgroundHighlight: colors.blue,
    color: darkColor,
    colorHighlight: '#fff',
    colorHighlightActive: '#fff',
    borderColor: [180, 180, 180, 0.25],
    borderColorActive: [180, 180, 180, 0.25],
    borderColorLight: [180, 180, 180, 0.15],
  }),
}

// makes it so we can reference the above base styles for the rest
dark = {
  ...dark,
  ...colorize({
    sidebarBackground: [15, 15, 15],
    sidebarBackgroundTransparent: [15, 15, 15, 0.2],
    sidebarBorderColor: '#444',
    headerBorderBottom: '#151515',
    headerBackground: linearGradient([0, 0, 0, 0.2], [0, 0, 0, 0.34]),
    headerBackgroundOpaque: linearGradient('#3f3f3f', '#353535'),
    orbitHeaderBackgroundEditing: linearGradient('#163278', '#192B5C'),
    orbitInputBackgroundEditing: [0, 0, 0, 0.2],
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
    tabBackgroundHover: [255, 255, 255, 0.1],
    tabBackgroundActive: [255, 255, 255, 0.125],
    tabBackgroundSelected: dark.backgroundStronger,
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
    cardShadow: [0, 6, 14, [0, 0, 0, 0.08]],
    cardHoverGlow: [0, 0, 0, 2, [0, 0, 0, 0.15]],
    panelHeaderBackground: darkBackground.lighten(0.15),
    redTint: '#ff000011',
    yellowTint: '#FFCA0011',
  }),
}

export const themes = {
  ...alternates,
  tooltip: fromStyles({
    background: 'rgba(20,20,20,0.94)',
    backgroundHover: 'rgba(28,28,28,0.94)',
    color: '#fff',
  }),
  dark,
  light,
}
