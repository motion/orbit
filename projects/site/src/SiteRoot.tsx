import { ErrorBoundary } from '@o/ui'
import React, { StrictMode, Suspense } from 'react'
import { Router, View } from 'react-navi'

import { Layout } from './Layout'
import { Navigation } from './Navigation'
import { SiteStoreContext } from './SiteStore'

export const SiteRoot = () => {
  return (
    <StrictMode>
      <ErrorBoundary name="Site Root">
        <SiteStoreContext.Provider>
          {/* this key helps HMR for lazy imports... but it breaks scroll position */}
          <Router
            // key={process.env.NODE_ENV === 'development' ? Math.random() : 0}
            navigation={Navigation}
          >
            <Layout>
              <Suspense fallback={null}>
                <View hashScrollBehavior="smooth" />
              </Suspense>
            </Layout>
          </Router>
        </SiteStoreContext.Provider>
      </ErrorBoundary>
    </StrictMode>
  )
}
