import { themes } from '@o/kit'
import { ContextMenuProvider, ErrorBoundary, Loading, ProvideUI } from '@o/ui'
import { Provider } from 'overmind-react'
import React, { useLayoutEffect } from 'react'
import { hot } from 'react-hot-loader/root'

import { IS_ELECTRON } from './constants'
import ContextMenu from './helpers/electron/ContextMenu.electron'
import { om } from './om/om'
import { useThemeStore } from './om/stores'
import { OrbitPage } from './pages/OrbitPage/OrbitPage'
import { useCaptureLinks } from './useCaptureLinks'

export const OrbitRoot = hot(function OrbitRoot() {
  const themeStore = useThemeStore()

  useLayoutEffect(() => {
    if (!IS_ELECTRON) {
      // @ts-ignore
      document.body.style.background = themes[themeStore.themeColor].background.toString()
    }
  }, [themeStore.themeColor])

  useCaptureLinks(document)

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
