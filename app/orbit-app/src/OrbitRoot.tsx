import { command } from '@o/bridge'
import { themes } from '@o/kit'
import { OpenCommand } from '@o/models'
import { ContextMenuProvider, ErrorBoundary, ProvideUI } from '@o/ui'
import React, { useEffect } from 'react'
import { hot } from 'react-hot-loader/root'

import { IS_ELECTRON } from './constants'
import ContextMenu from './helpers/electron/ContextMenu.electron'
import { OrbitPage } from './pages/OrbitPage/OrbitPage'

export const OrbitRoot = hot(() => {
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
    <ContextMenuProvider
      onContextMenu={items => {
        if (IS_ELECTRON) {
          ContextMenu.update({ prepend: items })
        }
      }}
    >
      <ProvideUI themes={themes}>
        <ErrorBoundary name="Root">
          <React.Suspense fallback={null}>
            <OrbitPage />
          </React.Suspense>
        </ErrorBoundary>
      </ProvideUI>
    </ContextMenuProvider>
  )
})

if (process.env.NODE_ENV === 'development' && module['hot']) {
  module['hot'].addStatusHandler(status => {
    if (status === 'apply') {
      console.log('[HMR] finished')
    }
  })
}
