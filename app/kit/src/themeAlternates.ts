import { invertLightness } from '@o/color'
import { ThemeSet } from '@o/css'
import { colorize, fromStyles } from 'gloss-theme'

import { colors, transparent } from './themeColors'

const colorThemes: ThemeSet = {
  // light
  lightGray: fromStyles({
    glintColor: transparent,
    color: '#444',
    iconColor: '#444',
    background: colors.lightGray.alpha(0.2),
    backgroundHover: colors.lightGray.alpha(0.2),
    backgroundActive: colors.lightGray.alpha(0.2),
  }),
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
  gray: fromStyles({
    glintColor: transparent,
    color: '#444',
    iconColor: '#444',
    background: colors.gray,
    backgroundHover: colors.gray,
    backgroundActive: colors.gray,
  }),
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

export const alternates: ThemeSet = {
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
    const background = invertLightness(parent.background, 0.05).alpha(0.35)
    return {
      color: parent.color,
      searchInputSizeRadius: 1,
      background,
      backgroundHover: background,
      buttonBackgroundHover: invertLightness(background, 0.05),
      backgroundFocus: background.darken(0.05),
      backgroundActive: background.darken(0.05),
      colorDisabled: parent.color.alpha(0.15),
      backgroundStrong: parent.backgroundStrong,
      backgroundStronger: parent.backgroundStronger,
      backgroundStrongest: parent.backgroundStrongest,
      glintColor: transparent,
      glintColorBottom: transparent,
      ...colorize({
        borderColor: transparent,
        borderWidth: 0,
      }),
    }
  },
}
