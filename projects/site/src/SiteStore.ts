import { createStoreContext, react } from '@o/use-store'

class SiteStore {
  loadingTheme = null
  screenSize = 'large'
  maxHeight = null
  showSidebar = false

  windowHeight = window.innerHeight

  ensureDontGetStuckLoadingTheme = react(
    () => this.loadingTheme,
    async (_, { sleep }) => {
      await sleep(300)
      if (this.loadingTheme) {
        this.setTheme(this.loadingTheme)
      }
    },
  )

  toggleSidebar = () => {
    this.showSidebar = !this.showSidebar
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
