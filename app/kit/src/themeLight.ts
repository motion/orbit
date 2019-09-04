import { linearGradient, toColor } from '@o/color'
import { ThemeObject } from 'gloss'
import { fromStyles } from 'gloss-theme'

import { alternates } from './themeAlternates'
import { colors } from './themeColors'

const lightColor = '#444'
const lightBackground = toColor('#fff')
const lightButtonBg = linearGradient('#FCFCFC', '#F5F5F6')

const backgroundStrong = lightBackground.darken(0.025)
const backgroundStronger = lightBackground.darken(0.05)
const backgroundStrongest = lightBackground.darken(0.075)

export const light: ThemeObject = Object.freeze({
  _name: 'light',
  alternates,
  cardShadow: [0, 6, 14, [0, 0, 0, 0.058]],
  cardHoverGlow: [0, 0, 0, 2, [0, 0, 0, 0.05]],
  boxShadowOpacity: 0.01,
  ...fromStyles({
    iconFillColor: '#000',
    glintColor: [255, 255, 255, 0.85],
    background: lightBackground,
    backgroundStrong,
    backgroundStronger,
    backgroundStrongest,
    backgroundZebra: '#f6f7f9aa',
    backgroundHighlightActive: colors.blue.lighten(0.1),
    backgroundHighlight: colors.blue,
    boxShadowColor: [0, 0, 0],
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
    borderColor: [215, 215, 215],
    borderColorActive: [215, 215, 215],
    borderColorHover: [215, 215, 215],
    borderColorLight: [215, 215, 215, 0.5],
    headerBackground: linearGradient([255, 255, 255, 0.75], [255, 255, 255, 0.7]),
    sidebarBackground: '#f5f7f9',
    sidebarBackgroundTransparent: [255, 255, 255, 0.7],
    appCardBackground: '#f5f7f9',
    appCardBackgroundTransparent: [255, 255, 255, 0],
    orbitLauncherBackground: [255, 255, 255, 0.34],
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
    separatorBackground: backgroundStrong.setAlpha(0.5),
  }),
})
