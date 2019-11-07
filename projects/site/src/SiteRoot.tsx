// //!
// import { ProvideUI } from '@o/ui'
// import { Box, gloss } from 'gloss'
// const LinkRow = gloss(Box, {
//   flexDirection: 'row',
//   flex: 1,
//   alignItems: 'center',
//   justifyContent: 'center',
//   zIndex: 1000000000,
//   position: 'relative',
// })
// const React = require('react')
// const { themes } = require('./themes')
// export const SiteRoot = () => {
//   return (
//     <ProvideUI themes={themes} activeTheme="dark">
//       <LinkRow>ok</LinkRow>
//     </ProvideUI>
//   )
// }
import { ErrorBoundary, ProvideUI } from '@o/ui'
import React, { StrictMode, Suspense } from 'react'
import { Router, View } from 'react-navi'

import { Layout } from './Layout'
import { Navigation } from './Navigation'
import { SiteStoreContext } from './SiteStore'
import { themes } from './themes'

export const SiteRoot = () => {
  return (
    <ProvideUI themes={themes} activeTheme="home">
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
    </ProvideUI>
  )
}
