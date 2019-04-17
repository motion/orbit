import { createStoreContext } from '@o/kit'
import { Theme, Title, View } from '@o/ui'
import { throttle } from 'lodash'
import React, { useEffect } from 'react'
import BusyIndicator from 'react-busy-indicator'
import { NotFoundBoundary, useLoadingRoute } from 'react-navi'
import { useScreenSize } from './hooks/useScreenSize'
import { getPageForPath, Navigation } from './SiteRoot'
import { LinksLeft, LinksRight } from './views/Header'

class SiteStore {
  theme = null
  screenSize = 'large'
  maxHeight = null
  showSidebar = false

  windowHeight = window.innerHeight

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

const { SimpleProvider, useStore, useCreateStore } = createStoreContext(SiteStore)

export const useSiteStore = useStore

const transition = 'transform ease 300ms'

export function Layout(props: any) {
  const loadingRoute = useLoadingRoute()
  const siteStore = useCreateStore()
  const screen = useScreenSize()
  const sidebarWidth = 400

  window['SiteStore'] = siteStore

  useEffect(() => {
    siteStore.screenSize = screen
  }, [screen])

  useEffect(() => {
    async function updatePath() {
      const page = await getPageForPath()
      if (page && page.theme) {
        siteStore.setTheme(page.theme)
      }
    }

    Navigation.subscribe(updatePath)
    updatePath()
  }, [])

  useEffect(() => {
    window.addEventListener(
      'resize',
      throttle(() => {
        siteStore.windowHeight = window.innerHeight
      }, 64),
    )
  }, [])

  if (!siteStore.theme) {
    return null
  }

  return (
    <Theme name={siteStore.theme}>
      <SimpleProvider value={siteStore}>
        <View
          minHeight="100vh"
          minWidth="100vw"
          maxHeight={siteStore.showSidebar ? window.innerHeight : siteStore.maxHeight}
          overflow="hidden"
          transition={transition}
          transform={{
            x: siteStore.showSidebar ? -sidebarWidth : 0,
          }}
          background={bg}
        >
          <NotFoundBoundary render={NotFound}>
            <BusyIndicator isBusy={!!loadingRoute} delayMs={100} />
            {props.children}
          </NotFoundBoundary>
        </View>
        <View
          position="fixed"
          top={0}
          right={0}
          width={sidebarWidth}
          height="100vh"
          transition={transition}
          transform={{
            x: siteStore.showSidebar ? 0 : sidebarWidth,
          }}
        >
          <LinksLeft {...linkProps} />
          <LinksRight {...linkProps} />
        </View>
      </SimpleProvider>
    </Theme>
  )
}

const linkProps = {
  width: '100%',
  padding: 20,
  fontSize: 22,
  textAlign: 'left',
}

const bg = theme => theme.background

function NotFound() {
  return (
    <View>
      <Title>Not found</Title>
    </View>
  )
}
