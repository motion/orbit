// @flow
import { ThemeMaker } from '@mcro/ui'

const Theme = new ThemeMaker()
const highlightColor = '#fff'
const highlightBackground = 'rgb(114, 121, 167)'

const Themes = {
  light: Theme.fromStyles({
    highlightBackground,
    highlightColor,
    background: '#fff',
    color: '#222',
    borderColor: '#eee',
    buttonBackground: 'linear-gradient(#fff, #fefefe)',
  }),
  clear: {
    button: {
      borderTopWidth: 0,
      borderLeftWidth: 0,
      borderRightWidth: 0,
    },
    glow: {
      color: [255, 255, 255, 0.1],
    },
    ...Theme.fromStyles({
      highlightBackground,
      highlightColor,
      background: [255, 255, 255, 1],
      color: '#555',
      borderColor: [0, 0, 0, 0.1],
    }),
  },
  gray: Theme.fromStyles({
    highlightBackground,
    highlightColor,
    background: '#eee',
    color: '#666',
    borderColor: '#eee',
  }),
  dark: Theme.fromStyles({
    highlightBackground: [0, 0, 0, 0.05],
    highlightColor,
    background: '#333',
    color: '#fff',
    borderColor: '#222',
  }),
}

window.Themes = Themes
export default Themes
