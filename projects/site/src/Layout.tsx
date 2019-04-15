import { createStoreContext } from '@o/kit'
import { Theme, Title, View } from '@o/ui'
import { throttle } from 'lodash'
import React, { useEffect } from 'react'
import BusyIndicator from 'react-busy-indicator'
import { NotFoundBoundary, useLoadingRoute } from 'react-navi'
import { getPageForPath, Navigation } from './SiteRoot'

class SiteStore {
  theme = null

  windowHeight = window.innerHeight

  setTheme = (name: string) => {
    this.theme = name
  }

  get sectionHeight() {
    return Math.min(
      // min-height
      Math.max(850, this.windowHeight),
      // max-height
      1100,
    )
  }
}

const { SimpleProvider, useStore, useCreateStore } = createStoreContext(SiteStore)

export const useSiteStore = useStore

export function Layout(props: any) {
  const loadingRoute = useLoadingRoute()
  const siteStore = useCreateStore()

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
  })

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
          transition="all ease 500ms"
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
