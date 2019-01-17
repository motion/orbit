// import dev helpers
import { command } from '@mcro/model-bridge'
import { OpenCommand } from '@mcro/models'
import { App } from '@mcro/stores'
import { ThemeProvide } from '@mcro/ui'
import { createNavigator, SceneView, SwitchRouter } from '@react-navigation/core'
import { createBrowserApp } from '@react-navigation/web'
import { isEqual, throttle } from 'lodash'
import * as React from 'react'
import { hot } from 'react-hot-loader'
import './helpers/installDevelopmentHelpers'
import OrbitPage from './pages/OrbitPage/OrbitPage'
import { themes } from './themes'

// pages

function AsyncPage({ page, fallback = <div>Loading...</div>, ...props }) {
  const Page = React.lazy(page)
  return (
    <React.Suspense fallback={fallback}>
      <Page {...props} />
    </React.Suspense>
  )
}

function getOrbitBrowser() {
  // cache for HMR
  if (window['orbitBrowser']) {
    return window['orbitBrowser']
  }

  const Orbit = ({ descriptors, navigation }) => {
    const activeKey = navigation.state.routes[navigation.state.index].key
    const descriptor = descriptors[activeKey]
    return <SceneView component={descriptor.getComponent()} navigation={descriptor.navigation} />
  }

  const navigator = createNavigator(
    Orbit,
    SwitchRouter({
      // HMR wont work here if you do the import method
      // for now just importing this directly...
      // in development mode we could have a switch here to always import all
      Home: OrbitPage,
      App: props => <AsyncPage page={() => import('./pages/AppPage/AppPage')} {...props} />,
      Chrome: props => (
        <AsyncPage page={() => import('./pages/ChromePage/ChromePage')} {...props} />
      ),
      Cosal: props => <AsyncPage page={() => import('./pages/CosalPage/CosalPage')} {...props} />,
    }),
    {},
  )

  const OrbitBrowser = createBrowserApp(navigator)
  window['orbitBrowser'] = OrbitBrowser
  return OrbitBrowser
}

export const OrbitRoot = hot(module)(() => {
  const OrbitBrowser = getOrbitBrowser()

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
        command(OpenCommand, { url: event.target.href })
      }
    }
    document.addEventListener('click', onClickLink)
    return () => {
      document.removeEventListener('click', onClickLink)
    }
  })

  return (
    <ThemeProvide themes={themes}>
      <OrbitBrowser />
    </ThemeProvide>
  )
})
