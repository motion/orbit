import { ContextMenuProvider, ErrorBoundary, Loading, ProvideBanner, ProvideUI, themes } from '@o/ui'
import React from 'react'

import { IS_ELECTRON } from './constants'
import ContextMenu from './helpers/electron/ContextMenu.electron'
import { useThemeStore } from './om/stores'
import { useCaptureLinks } from './useCaptureLinks'

export function OrbitRoot() {
  const themeStore = useThemeStore()

  useCaptureLinks(document)

  let CurPage: any = null

  if (window.location.pathname === '/chrome') {
    // CurPage = React.lazy(() => import('./pages/ChromePage/ChromePage'))
    CurPage = require('./pages/ChromePage/ChromePage').default
  } else {
    // CurPage = React.lazy(() => import('./pages/OrbitPage/OrbitPage'))
    CurPage = require('./pages/OrbitPage/OrbitPage').default
  }

  return (
    <ProvideUI themes={themes} activeTheme={themeStore.themeColor}>
      <ContextMenuProvider
        onContextMenu={items => {
          if (IS_ELECTRON) {
            ContextMenu.update({ prepend: items })
          }
        }}
      >
        <ProvideBanner>
          <ErrorBoundary name="Root">
            <React.Suspense fallback={<Loading />}>
              <CurPage />
            </React.Suspense>
          </ErrorBoundary>
        </ProvideBanner>
      </ContextMenuProvider>
    </ProvideUI>
  )
}

if (process.env.NODE_ENV === 'development' && module['hot']) {
  module['hot'].addStatusHandler(status => {
    if (status === 'apply') {
      console.log('[HMR] finished')
    }
  })
  module['hot'].accept()
}
