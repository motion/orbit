import './helpers/installDevelopmentHelpers'

import { command } from '@o/bridge'
import { themes } from '@o/kit'
import { OpenCommand } from '@o/models'
import { ContextMenuProvider, ErrorBoundary, ProvideUI } from '@o/ui'
import * as React from 'react'
import { hot } from 'react-hot-loader/root'
import { Router, View } from 'react-navi'

import { IS_ELECTRON } from './constants'
import ContextMenu from './helpers/electron/ContextMenu.electron'
import { Navigation } from './OrbitNavigation'

export const OrbitRoot = hot(() => {
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

  console.log('Navigation', Navigation)

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
          <Router navigation={Navigation}>
            <React.Suspense fallback={null}>
              <View hashScrollBehavior="smooth" />
            </React.Suspense>
          </Router>
        </ErrorBoundary>
      </ProvideUI>
    </ContextMenuProvider>
  )
})
