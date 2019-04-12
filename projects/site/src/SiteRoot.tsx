import { createStoreContext } from '@o/kit'
import { ProvideUI } from '@o/ui'
import { createNavigator, SceneView, SwitchRouter } from '@react-navigation/core'
import { createBrowserApp } from '@react-navigation/web'
import * as React from 'react'
import { hot } from 'react-hot-loader/root'
import { DocsPage } from './pages/DocsPage'
import { HomePage } from './pages/HomePage'
import { themes } from './themes'
import { MDX } from './views/MDX'

class SiteStore {
  windowHeight = window.innerHeight

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

function getSiteBrowser() {
  if (window['SiteBrowser']) {
    return window['SiteBrowser']
  }

  const Site = ({ descriptors, navigation }) => {
    const activeKey = navigation.state.routes[navigation.state.index].key
    const descriptor = descriptors[activeKey]
    return <SceneView component={descriptor.getComponent()} navigation={descriptor.navigation} />
  }

  const navigator = createNavigator(
    Site,
    SwitchRouter({
      Home: HomePage,
      Docs: DocsPage,
    }),
    {},
  )

  const browser = createBrowserApp(navigator)

  window['SiteBrowser'] = browser
  return browser
}

export const SiteRoot = hot(() => {
  const SiteBrowser = getSiteBrowser()
  const siteStore = useCreateStore()

  React.useEffect(() => {
    window.addEventListener('resize', () => {
      siteStore.windowHeight = window.innerHeight
    })
  })

  return (
    <ProvideUI themes={themes} activeTheme="light">
      <MDX>
        <SimpleProvider value={siteStore}>
          <SiteBrowser />
        </SimpleProvider>
      </MDX>
    </ProvideUI>
  )
})
