import { ProvideUI } from '@o/ui'
import { createNavigator, SceneView, SwitchRouter } from '@react-navigation/core'
import { createBrowserApp } from '@react-navigation/web'
import * as React from 'react'
import { hot } from 'react-hot-loader/root'
import { DocsPage } from './pages/DocsPage'
import { HomePage } from './pages/HomePage'
import { ProvideSiteStore } from './SiteStore'
import { themes } from './themes'
import { MDX } from './views/MDX'

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

  return (
    <ProvideUI themes={themes} activeTheme="light">
      <MDX>
        <ProvideSiteStore>
          <SiteBrowser />
        </ProvideSiteStore>
      </MDX>
    </ProvideUI>
  )
})
