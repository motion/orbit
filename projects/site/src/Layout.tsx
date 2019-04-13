import { createStoreContext } from '@o/kit';
import { Theme, Title, View } from '@o/ui';
import React, { useEffect } from 'react';
import BusyIndicator from 'react-busy-indicator';
import { NotFoundBoundary, useLoadingRoute } from 'react-navi';

class SiteStore {
  theme = 'light'

  windowHeight = window.innerHeight

  setTheme = (name: string) => {
    this.theme = name
  }

  get sectionHeight() {
    return Math.min(
      // min-height
      Math.max(800, this.windowHeight),
      // max-height
      1000,
    )
  }
}

const { SimpleProvider, useStore, useCreateStore } = createStoreContext(SiteStore)

export const useSiteStore = useStore

export function Layout(props: any) {
  const loadingRoute = useLoadingRoute()
  const siteStore = useCreateStore()

  console.log('siteStore', siteStore)
  useEffect(() => {
    window.addEventListener('resize', () => {
      siteStore.windowHeight = window.innerHeight
    })
  })

  return (
    <Theme name={siteStore.theme}>
      <SimpleProvider value={siteStore}>
        <View flex={1} background={bg} transition="all ease 500ms">
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
