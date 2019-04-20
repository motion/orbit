import { createStoreContext, react } from '@o/use-store'
import { once } from 'lodash'

import { themes } from './themes'

class SiteStore {
  theme = 'home'
  screenSize = 'large'
  maxHeight = null
  showSidebar = false

  windowHeight = window.innerHeight
  tag = document.createElement('style')

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

  setup = once(() => {
    this.tag.type = 'text/css'
    this.tag.appendChild(document.createTextNode(''))
    document.head.appendChild(this.tag)
  })

  setTheme = (name: string) => {
    this.setup()
    const sheet = this.tag.sheet as CSSStyleSheet
    sheet.insertRule(
      `
    * {
      transition: all ease 1000ms !important;
    }
  `,
      sheet.cssRules.length,
    )
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
