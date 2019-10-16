import { BorderBottom, ErrorBoundary, ProvideUI } from '@o/ui'
import React, { StrictMode, Suspense } from 'react'

import { SiteStoreContext } from './SiteStore'
import { themes } from './themes'

export const SiteRoot = () => {
  return (
    <StrictMode>
      <ProvideUI themes={themes} activeTheme="home">
        <ErrorBoundary name="Site Root">
          <SiteStoreContext.Provider>
            <BorderBottom />
            {/* this key helps HMR for lazy imports... but it breaks scroll position */}
            {/* <Router
              // key={process.env.NODE_ENV === 'development' ? Math.random() : 0}
              navigation={Navigation}
            >
              <Layout>
                <Suspense fallback={null}>
                  <View hashScrollBehavior="smooth" />
                </Suspense>
              </Layout>
            </Router> */}
          </SiteStoreContext.Provider>
        </ErrorBoundary>
      </ProvideUI>
    </StrictMode>
  )
}
