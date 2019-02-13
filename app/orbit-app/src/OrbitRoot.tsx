// import { useStore } from '@mcro/use-store'
// import React from 'react'
// import { hot } from 'react-hot-loader'
// import { ProvideStores } from './components/ProvideStores'
// import { useStores } from './hooks/useStores'

// class Ok {
//   x = 1
//   y = {}
// }

// export const OrbitRoot = hot(module)(function OrbitRoot() {
//   const store = useStore(Ok)

//   return (
//     <div>
//       <ProvideStores stores={{ store }}>
//         {store.x}
//         {store.y[0]}
//         <button onClick={() => store.x++}>up</button>
//         <button onClick={() => (store.y = store.y)}>222</button>
//         <SubView />
//       </ProvideStores>
//     </div>
//   )
// })

// function SubView() {
//   // @ts-ignore
//   const { store } = useStores()
//   return <div>sub sub {store.x}</div>
// }

import { OpenCommand } from '@mcro/models'
import { ContextMenuProvider, ThemeProvide } from '@mcro/ui'
import { createNavigator, SceneView, SwitchRouter } from '@react-navigation/core'
import { createBrowserApp } from '@react-navigation/web'
import contextMenu from 'electron-context-menu'
import * as React from 'react'
import { hot } from 'react-hot-loader'
import './helpers/installDevelopmentHelpers'
import { command } from './mediator'
import ChromePage from './pages/ChromePage/ChromePage'
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
      Chrome: ChromePage,
      // Chrome: props => (
      //   <AsyncPage page={() => import('./pages/ChromePage/ChromePage')} {...props} />
      // ),
      Cosal: props => <AsyncPage page={() => import('./pages/CosalPage/CosalPage')} {...props} />,
    }),
    {},
  )

  const OrbitBrowser = createBrowserApp(navigator)
  window['orbitBrowser'] = OrbitBrowser
  return OrbitBrowser
}

export const OrbitRoot = hot(module)(function OrbitRoot() {
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

  // context menu
  const contextMenuItems = React.useRef([])
  React.useEffect(() => {
    contextMenu({
      prepend: (/* params, browserWindow */) => {
        return contextMenuItems.current
      },
    })
  }, [])

  return (
    <ContextMenuProvider
      onContextMenu={items => {
        contextMenuItems.current = items
      }}
    >
      <ThemeProvide themes={themes}>
        <OrbitBrowser />
      </ThemeProvide>
    </ContextMenuProvider>
  )
})
