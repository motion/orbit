import { ErrorBoundary, idFn } from '@o/ui'
import { useForceUpdate } from '@o/use-store'
import React, { Suspense } from 'react'
import { hot } from 'react-hot-loader/root'
import { Router, View } from 'react-navi'

import { Layout } from './Layout'
import { Navigation } from './Navigation'
import { SiteStoreContext } from './SiteStore'

let curForceUpdate = idFn as any
const forceUpdate = () => curForceUpdate()

export const SiteRoot = hot(() => {
  const disableScrolling = window['recentHMR']
  // to be sure we get the disableScrolling
  curForceUpdate = useForceUpdate()
  return (
    <ErrorBoundary name="Site Root">
      <SiteStoreContext.Provider>
        {/* this key helps HMR for lazy imports... */}
        <Router
          key={process.env.NODE_ENV === 'development' ? Math.random() : 0}
          navigation={Navigation}
        >
          <Layout>
            <Suspense fallback={null}>
              <View disableScrolling={disableScrolling} hashScrollBehavior="smooth" />
            </Suspense>
          </Layout>
        </Router>
      </SiteStoreContext.Provider>
    </ErrorBoundary>
  )
})

window['recentHMR'] = false

if (module['hot']) {
  let tm
  module['hot'].addStatusHandler(() => {
    window['recentHMR'] = true
    forceUpdate()
    clearTimeout(tm)
    tm = setTimeout(() => {
      window['recentHMR'] = false
    }, 500)
  })
}
