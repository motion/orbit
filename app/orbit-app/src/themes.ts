import { ThemeMaker, color } from '@mcro/gloss'

const Theme = new ThemeMaker()

const tanBg = color('rgb(255,255,245)')
const tanHoverBg = tanBg.darken(0.02).desaturate(0.3)
const tanActiveBg = tanHoverBg.darken(0.05).desaturate(0.3)

const orbitColor = color('#3d91ff')
const orbitHoverBg = orbitColor.darken(0.02).desaturate(0.3)
const orbitActiveBg = orbitHoverBg.darken(0.05).desaturate(0.3)

const macTheme = Theme.colorize({
  highlight: '#dbe7fa', // used for text selection, tokens, etc.
  highlightActive: '#85afee', // active tokens

  // sub-themes go into their own objects so they can be narrowed into
  titleBar: {
    background: '#eae9eb',
    backgroundBottom: '#dcdbdc',
    backgroundGradient: 'linear-gradient(to bottom, #eae9eb 0%, #dcdbdc 100%)',
    backgroundBlur: '#f6f6f6',
    borderColor: '#c1c0c2',
    borderColorBlur: '#cecece',
    icon: '#6f6f6f',
    iconBlur: '#acacac',
    iconSelected: '#4d84f5',
    iconSelectedBlur: '#80a6f5',
    iconActive: '#4c4c4c',
    buttonBorderColor: '#d3d2d3',
    buttonBorderBottom: '#b0afb0',
    buttonBorderBlur: '#dbdbdb',
    buttonBackground: 'linear-gradient(#FDFDFD, #F0F0F0)',
    buttonBackgroundBlur: '#f6f6f6',
    buttonBackgroundActiveHighlight: '#ededed',
  },
})

export const themes = {
  orbit: Theme.fromStyles({
    background: orbitColor,
    color: '#fff',
    borderColor: orbitActiveBg,
  }),
  dark: {
    ...macTheme,
    cardBackground: 'rgba(80, 80, 80, 0.25)',
    cardShadow: [0, 6, 14, [0, 0, 0, 0.08]],
    ...Theme.fromStyles({
      background: 'rgba(20,20,20,0.94)',
      backgroundHover: 'rgba(20,20,20,0.2)',
      color: '#fff',
      borderColor: '#222',
    }),
    colorActive: '#fff',
  },
  light: {
    ...macTheme,
    inputBackground: '#e9e9e9',
    inputBackgroundActive: '#eee',
    cardShadow: [0, 2, 6, [0, 0, 0, 0.035]],
    ...Theme.fromStyles({
      background: 'rgba(255,255,255,0.94)',
      color: '#444',
      borderColor: '#e2e2e2',
    }),
  },
  tan: {
    ...macTheme,
    ...Theme.fromStyles({
      background: tanBg,
      color: '#656141',
      borderColor: tanActiveBg,
    }),
  },
}
