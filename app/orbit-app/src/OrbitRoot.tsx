// import dev helpers
import './helpers/installDevelopmentHelpers'

import * as React from 'react'
import { createNavigator, SwitchRouter, SceneView } from '@react-navigation/core'
import { createBrowserApp } from '@react-navigation/web'
import { hot } from 'react-hot-loader'
import { ThemeProvide } from '@mcro/ui'
import { themes } from './themes'
import { throttle, isEqual } from 'lodash'
import { App, Desktop } from '@mcro/stores'

// pages

function AsyncPage({ page, fallback = <div>Loading...</div>, ...props }) {
  const Page = React.lazy(page)
  return (
    <React.Suspense fallback={fallback}>
      <Page {...props} />
    </React.Suspense>
  )
}

function getOrbitNavigator() {
  const Orbit = ({ descriptors, navigation }) => {
    const activeKey = navigation.state.routes[navigation.state.index].key
    const descriptor = descriptors[activeKey]
    return <SceneView component={descriptor.getComponent()} navigation={descriptor.navigation} />
  }

  return createNavigator(
    Orbit,
    SwitchRouter({
      Home: props => <AsyncPage page={() => import('./pages/OrbitPage/OrbitPage')} {...props} />,
      App: props => <AsyncPage page={() => import('./pages/AppPage/AppPage')} {...props} />,
      Chrome: props => (
        <AsyncPage page={() => import('./pages/ChromePage/ChromePage')} {...props} />
      ),
      Cosal: props => <AsyncPage page={() => import('./pages/CosalPage/CosalPage')} {...props} />,
    }),
    {},
  )
}

export const OrbitRoot = hot(module)(() => {
  const OrbitNavigator = getOrbitNavigator()
  const OrbitBrowser = createBrowserApp(OrbitNavigator)

  // update screen size state
  React.useEffect(() => {
    const handleWindowResize = throttle(() => {
      if (!App.setState) {
        return
      }
      const screenSize = [window.innerWidth, window.innerHeight]
      if (!isEqual(App.state.screenSize, screenSize)) {
        App.setState({ screenSize })
      }
    }, 16 * 4)

    window.addEventListener('resize', handleWindowResize)
    return () => {
      window.removeEventListener('resize', handleWindowResize)
    }
  })

  // capture un-captured links
  // if you don't then clicking a link will cause electron to go there
  // this is a good safeguard
  React.useEffect(() => {
    const onClickLink = event => {
      if (event.target.tagName === 'A' && event.target.href.startsWith('http')) {
        event.preventDefault()
        console.log('Capturing a A tag from root', event.target.href)
        App.sendMessage(Desktop, Desktop.messages.OPEN, event.target.href)
      }
    }
    document.addEventListener('click', onClickLink)
    return () => {
      document.removeEventListener('click', onClickLink)
    }
  })

  return (
    <div style={{ pointerEvents: 'auto' }}>
      <ThemeProvide themes={themes}>
        <OrbitBrowser />
      </ThemeProvide>
    </div>
  )
})
