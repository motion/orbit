// @flow
import { ThemeMaker } from '@mcro/ui'

const Theme = new ThemeMaker()
const highlightColor = '#fff'

const Themes = {
  dark: Theme.fromStyles({
    highlightBackground: [0, 0, 0, 0.05],
    highlightColor,
    background: '#333',
    color: '#fff',
    borderColor: '#222',
  }),
}

export default Themes
