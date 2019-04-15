import { createStoreContext } from '@o/kit'
import { Theme, Title, View } from '@o/ui'
import { throttle } from 'lodash'
import React, { useEffect } from 'react'
import BusyIndicator from 'react-busy-indicator'
import { NotFoundBoundary, useLoadingRoute } from 'react-navi'
import { useScreenSize } from './hooks/useScreenSize'
import { getPageForPath, Navigation } from './SiteRoot'

class SiteStore {
  theme = null
  screenSize = 'large'

  windowHeight = window.innerHeight

  setTheme = (name: string) => {
    this.theme = name
  }

  get sectionHeight() {
    let maxHeight = 1100
    let desiredHeight = this.windowHeight
    // taller on mobile
    if (this.screenSize === 'small') {
      desiredHeight = this.windowHeight
      maxHeight = this.windowHeight
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

export function Layout(props: any) {
  const loadingRoute = useLoadingRoute()
  const siteStore = useCreateStore()
  const screen = useScreenSize()

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
          overflow="hidden"
          background={bg}
          transition="background ease 500ms"
        >
          <NotFoundBoundary render={NotFound}>
            <BusyIndicator isBusy={!!loadingRoute} delayMs={150} />
            {props.children}
          </NotFoundBoundary>
        </View>
      </SimpleProvider>
    </Theme>
  )
}

const bg = theme => theme.background

function NotFound() {
  return (
    <View>
      <Title>Not found</Title>
    </View>
  )
}
