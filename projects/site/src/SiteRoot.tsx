import * as React from 'react'
import { createNavigator, SwitchRouter, SceneView } from '@react-navigation/core'
import { createBrowserApp } from '@react-navigation/web'
import { hot } from 'react-hot-loader'
import { HomePage } from './pages/HomePage'

function getSiteNavigator() {
  const Site = ({ descriptors, navigation }) => {
    const activeKey = navigation.state.routes[navigation.state.index].key
    const descriptor = descriptors[activeKey]
    return <SceneView component={descriptor.getComponent()} navigation={descriptor.navigation} />
  }

  return createNavigator(
    Site,
    SwitchRouter({
      Home: HomePage,
    }),
    {},
  )
}

export const SiteRoot = hot(module)(() => {
  const SiteNavigator = getSiteNavigator()
  const SiteBrowser = createBrowserApp(SiteNavigator)
  return <SiteBrowser />
})
