import { App } from '@o/stores'
import { themes } from '@o/ui'

export class ThemeStore {
  showSidebar = true

  setToggleShowSidebar = () => {
    this.showSidebar = !this.showSidebar
  }

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
