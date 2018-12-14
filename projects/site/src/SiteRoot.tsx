import * as React from 'react'
import { createNavigator, SwitchRouter, SceneView } from '@react-navigation/core'
import { createBrowserApp } from '@react-navigation/web'
import { HomePage } from './pages/HomePage'

const Site = ({ descriptors, navigation }) => {
  const activeKey = navigation.state.routes[navigation.state.index].key
  const descriptor = descriptors[activeKey]
  return <SceneView component={descriptor.getComponent()} navigation={descriptor.navigation} />
}

const SiteNavigator = createNavigator(
  Site,
  SwitchRouter({
    Home: HomePage,
  }),
  {},
)

export const SiteRoot = createBrowserApp(SiteNavigator)
