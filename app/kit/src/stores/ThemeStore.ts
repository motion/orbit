import { App } from '@mcro/stores'
import { themes } from '../themes'

export class ThemeStore {
  get theme() {
    return themes[this.themeColor]
  }

  get themeColor() {
    return App.isDark ? 'dark' : 'light'
  }

  get isDark() {
    return App.isDark
  }

  get vibrancy() {
    return App.vibrancy
  }
}
