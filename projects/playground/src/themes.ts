import { color, linearGradient, ThemeMaker } from '@o/gloss'

const Theme = new ThemeMaker()

const lightBackground = color('#fff')
const light = {
  ...Theme.fromStyles({
    backgroundAlternate: '#f6f7f9aa',
    background: lightBackground,
    mainBackground: lightBackground,
    backgroundActive: '#eee',
    backgroundHover: '#eee',
    color: '#444',
    borderColor: [215, 215, 215],
    cardShadow: [0, 2, 8, [0, 0, 0, 0.038]],
    cardHoverGlow: [0, 0, 0, 2, [0, 0, 0, 0.05]],
    headerBackground: linearGradient([245, 245, 245, 0.85], [245, 245, 245, 0.85]),
    sidebarBackground: [200, 200, 200, 0.05],
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
    background: 'blue',
    backgroundHover: 'blue',
    backgroundActive: 'blue',
    listItemBackground: 'blue',
    color: '#fff',
    borderColor: 'darkblue',
  }),
}

export const themes = {
  light,
  dark: Theme.fromStyles({
    background: '#111',
    color: '#fff',
  }),
  tooltip: {
    background: 'rgba(20,20,20,0.94)',
    color: '#fff',
  },
}
