import { App } from '@mcro/stores'

export class ThemeStore {
  get theme() {
    return App.isDark ? 'dark' : 'light'
  }

  get isDark() {
    return App.isDark
  }

  get vibrancy() {
    return App.vibrancy
  }
}
