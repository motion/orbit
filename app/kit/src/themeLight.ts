import { linearGradient, toColor } from '@o/color'
import { fromStyles } from 'gloss-theme'

import { alternates } from './themeAlternates'
import { colors } from './themeColors'

const lightColor = '#444'
const lightBackground = toColor('#fff')
const lightButtonBg = linearGradient('#FCFCFC', '#F5F5F6')

export const light = {
  alternates,
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
