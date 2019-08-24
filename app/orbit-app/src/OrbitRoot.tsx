import { themes } from '@o/kit'
import { ContextMenuProvider, ErrorBoundary, Loading, ProvideUI } from '@o/ui'
import { Provider } from 'overmind-react'
import React from 'react'
import { hot } from 'react-hot-loader/root'

import { IS_ELECTRON } from './constants'
import ContextMenu from './helpers/electron/ContextMenu.electron'
import { om } from './om/om'
import { useThemeStore } from './om/stores'
import { useCaptureLinks } from './useCaptureLinks'

export const OrbitRoot = hot(function OrbitRoot() {
  const themeStore = useThemeStore()

  useCaptureLinks(document)

  let CurPage: any = null

  if (window.location.pathname === '/chrome') {
    CurPage = React.lazy(() => import('./pages/ChromePage/ChromePage'))
  } else {
    CurPage = React.lazy(() => import('./pages/OrbitPage/OrbitPage'))
  }

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
              <CurPage />
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
