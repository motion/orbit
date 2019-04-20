import { createStoreContext, react } from '@o/use-store'

import { themes } from './themes'

class SiteStore {
  theme = 'home'
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

  setTheme = (name: string) => {
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
