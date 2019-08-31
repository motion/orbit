import { ErrorBoundary } from '@o/ui'
import React, { Suspense } from 'react'
import { hot } from 'react-hot-loader/root'
import { Router, View } from 'react-navi'

import { Layout } from './Layout'
import { Navigation } from './Navigation'
import { SiteStoreContext } from './SiteStore'

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
              <View disableScrolling={false} hashScrollBehavior="smooth" />
            </Suspense>
          </Layout>
        </Router>
      </SiteStoreContext.Provider>
    </ErrorBoundary>
  )
})
