import React, { Suspense } from 'react'
import { hot } from 'react-hot-loader/root'
import { Router, View } from 'react-navi'

import { Layout } from './Layout'
import { Navigation } from './Navigation'
import { SiteStoreContext } from './SiteStore'

export const SiteRoot = hot(() => {
  return (
    <SiteStoreContext.Provider>
      {/* this key helps HMR for lazy imports... */}
      <Router
        key={process.env.NODE_ENV === 'development' ? Math.random() : 0}
        navigation={Navigation}
      >
        <Layout>
          <Suspense fallback={null}>
            <View disableScrolling={recentHMR} hashScrollBehavior="smooth" />
          </Suspense>
        </Layout>
      </Router>
    </SiteStoreContext.Provider>
  )
})

export let recentHMR = false

if (module['hot']) {
  let tm
  module['hot'].addStatusHandler(() => {
    recentHMR = true
    clearTimeout(tm)
    tm = setTimeout(() => {
      recentHMR = false
    }, 500)
  })
}
