import { createStoreContext, react } from '@o/use-store'

import { themes } from './themes'

class SiteStore {
  theme = localStorage.getItem(`theme-${window.location.pathname}`) || 'home'
  loadingTheme = null
  screenSize = 'large'
  maxHeight = null
  showSidebar = false

  windowHeight = window.innerHeight

  bodyBackground = react(
    () => {
      console.log('run reaction')
      return this.theme
    },
    theme => {
      console.log('reacting to theme', theme)
      document.body.style.background = themes[theme].background.toCSS()
    },
  )

  toggleSidebar = () => {
    this.showSidebar = !this.showSidebar
  }

  setLoadingTheme = (name: string) => {
    this.loadingTheme = name
    localStorage.setItem(`theme-${window.location.pathname}`, name)
  }

  setTheme = (name: string) => {
    this.loadingTheme = null
    this.theme = name
  }

  setMaxHeight = (val: any) => {
    this.maxHeight = val
  }

  get sectionHeight() {
    let maxHeight = 1050
    let desiredHeight = this.windowHeight
    // taller on mobile
    if (this.screenSize === 'small') {
      desiredHeight = this.windowHeight
      maxHeight = 950
    }
    return Math.max(
      // min-height
      850,
      Math.min(
        desiredHeight,
        // max-height
        maxHeight,
      ),
    )
  }
}

export const SiteStoreContext = createStoreContext(SiteStore)
export const useSiteStore = SiteStoreContext.useStore
