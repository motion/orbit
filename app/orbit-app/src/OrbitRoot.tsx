import { command } from '@o/bridge'
import { themes } from '@o/kit'
import { OpenCommand } from '@o/models'
import { ContextMenuProvider, ErrorBoundary, Loading, ProvideUI } from '@o/ui'
import { Provider } from 'overmind-react'
import React, { useEffect, useLayoutEffect } from 'react'
import { hot } from 'react-hot-loader/root'

import { IS_ELECTRON } from './constants'
import ContextMenu from './helpers/electron/ContextMenu.electron'
import { om } from './om/om'
import { useThemeStore } from './om/stores'
import { OrbitPage } from './pages/OrbitPage/OrbitPage'

export const OrbitRoot = hot(function OrbitRoot() {
  const themeStore = useThemeStore()

  useLayoutEffect(() => {
    if (!IS_ELECTRON) {
      // @ts-ignore
      document.body.style.background = themes[themeStore.themeColor].background.toString()
    }
  }, [themeStore.themeColor])

  // capture un-captured links
  // if you don't then clicking a link will cause electron to go there
  // this is a good safeguard
  useEffect(() => {
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
    <Provider value={om}>
      <ContextMenuProvider
        onContextMenu={items => {
          if (IS_ELECTRON) {
            ContextMenu.update({ prepend: items })
          }
        }}
      >
        <ProvideUI themes={themes} activeTheme={themeStore.themeColor}>
          <ErrorBoundary name="Root">
            <React.Suspense fallback={<Loading />}>
              <OrbitPage />
            </React.Suspense>
          </ErrorBoundary>
        </ProvideUI>
      </ContextMenuProvider>
    </Provider>
  )
})

if (process.env.NODE_ENV === 'development' && module['hot']) {
  module['hot'].addStatusHandler(status => {
    if (status === 'apply') {
      console.log('[HMR] finished')
    }
  })
}
