import { command } from '@o/bridge'
import { themes } from '@o/kit'
import { OpenCommand } from '@o/models'
import { ContextMenuProvider, ThemeProvide } from '@o/ui'
import { createNavigator, SceneView, SwitchRouter } from '@react-navigation/core'
import { createBrowserApp } from '@react-navigation/web'
import * as React from 'react'
import { hot } from 'react-hot-loader'
import ContextMenu from './helpers/electron/ContextMenu.electron'
import './helpers/installDevelopmentHelpers'
import ChromePage from './pages/ChromePage/ChromePage'
import { OrbitPage } from './pages/OrbitPage/OrbitPage'

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
      Chrome: ChromePage,
      // Chrome: props => (
      //   <AsyncPage page={() => import('./pages/ChromePage/ChromePage')} {...props} />
      // ),
      // Cosal: props => <AsyncPage page={() => import('./pages/CosalPage/CosalPage')} {...props} />,
    }),
    {},
  )

  const OrbitBrowser = createBrowserApp(navigator)
  window['orbitBrowser'] = OrbitBrowser
  return OrbitBrowser
}

function OrbitRootInner() {
  const OrbitBrowser = getOrbitBrowser()

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
    <ContextMenuProvider
      onContextMenu={items => {
        if (ContextMenu) {
          ContextMenu.update({ prepend: items })
        }
      }}
    >
      <ThemeProvide themes={themes}>
        <OrbitBrowser />
      </ThemeProvide>
    </ContextMenuProvider>
  )
}

// class OrbitRootError extends React.Component {
//   componentDidCatch(error) {
//     console.log('got error')
//     console.error(error)
//   }

//   render() {
//     return <OrbitRootInner />
//   }
// }

export const OrbitRoot = hot(module)(OrbitRootInner)
