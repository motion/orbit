import { ErrorBoundary } from '@o/ui'
import React, { Suspense } from 'react'
import { hot } from 'react-hot-loader/root'
import { Router, View } from 'react-navi'

import { Header, Layout } from './Layout'
import { Navigation } from './Navigation'
import { SiteStoreContext } from './SiteStore'

console.log('Layout', Layout, Header)

export const SiteRoot = hot(() => {
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
              <View disableScrolling={window['recentHMR']} hashScrollBehavior="smooth" />
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
    clearTimeout(tm)
    tm = setTimeout(() => {
      window['recentHMR'] = false
    }, 500)
  })
}
