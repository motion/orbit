import { ThemeSet } from '@o/css'
import { linearGradient } from '@o/ui'
import { colorize, fromStyles } from 'gloss-theme'

import { colors, transparent } from './themeColors'

const colorThemes: ThemeSet = {
  // light
  lightGray: fromStyles({
    glintColor: transparent,
    color: '#444',
    iconColor: '#444',
    background: colors.lightGray,
    backgroundHover: colors.lightGray,
    backgroundActive: colors.lightGray,
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

export const coats: ThemeSet = Object.freeze({
  ...colorThemes,
  info: colorThemes.lightBlue,
  error: colorThemes.lightRed,
  delete: colorThemes.lightRed,
  fail: colorThemes.lightRed,
  failure: colorThemes.lightRed,
  warn: colorThemes.lightYellow,
  approve: colorThemes.lightGreen,
  success: colorThemes.lightGreen,
  confirm: {
    buttonFontWeight: 600,
    ...colorThemes.green,
  },
  action: {
    ...colorThemes.blue,
    buttonBackground: linearGradient(
      colorThemes.blue.background,
      colorThemes.blue.background.darken(0.1),
    ),
  },
  // looks bad...
  inverseAction: parent => {
    const isDark = parent.background.isDark()
    const background = isDark ? '#fff' : '#050505'
    const backgroundHover = isDark ? '#fff' : '#080808'
    return {
      ...colorize({
        background,
        backgroundHover: backgroundHover,
        backgroundActive: backgroundHover,
      }),
      color: colorThemes.blue.background,
    }
  },
  selected: {
    ...colorThemes.blue,
    // dont make selected things hover/active, they're active already
    backgroundHover: colorThemes.blue.background,
    backgroundActive: colorThemes.blue.background,
  },
  bordered: {
    disableGlint: true,
    borderWidth: 1,
    // borderColor: 'var(--colorHighlight)' as any,
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
  translucent: parent => ({
    name: `${parent.name}-translucent`,
    disableGlint: true,
    ...fromStyles({
      color: parent.color,
      background: parent.background.setAlpha(0.33),
      borderColor: parent.background.setAlpha(0.5),
    }),
  }),
  clear: parent => ({
    name: `${parent.name}-clear`,
    disableGlint: true,
    ...fromStyles({
      glintColor: transparent,
      color: parent.color,
      background: parent.background.isDark()
        ? parent.background.lighten(0.1).setAlpha(0.15)
        : parent.background.darken(0.1).setAlpha(0.15),
      borderColor: transparent,
      borderWidth: 0,
    }),
  }),
  flat: parent => {
    const background = parent.background.relativeLighten(0.05).setAlpha(0.5)
    return {
      name: `${parent.name}-flat`,
      searchInputSizeRadius: 1,
      disableGlint: true,
      background,
      backgroundHover: background,
      buttonBackground: background,
      buttonBackgroundHover: background.relativeLighten(0.025),
      backgroundFocus: background.darken(0.05),
      backgroundActive: background.darken(0.05),
      colorDisabled: parent.color.setAlpha(0.15),
      backgroundStrong: parent.backgroundStrong,
      backgroundStronger: parent.backgroundStronger,
      backgroundStrongest: parent.backgroundStrongest,
      ...colorize({
        borderColor: transparent,
        borderWidth: 0,
      }),
    }
  },
})
