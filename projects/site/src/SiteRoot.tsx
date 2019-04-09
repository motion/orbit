import { createNavigator, SceneView, SwitchRouter } from '@react-navigation/core'
import { createBrowserApp } from '@react-navigation/web'
import * as React from 'react'
import { hot } from 'react-hot-loader/root'
import { DocsPage } from './pages/DocsPage'
import { HomePage } from './pages/HomePage'

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
    <div style={{ pointerEvents: 'auto', minHeight: '100vh' }}>
      <SiteBrowser />
    </div>
  )
})
