// //!
// import { ProvideUI, View } from '@o/ui'
// import { gloss } from 'gloss'
// //
// const React = require('react')
// const { themes } = require('./themes')
// const OrbitToolbarChrome = gloss(View, {
//   flexDirection: 'row',
//   position: 'absolute',
//   top: 0,
//   left: 0,
//   right: 0,
//   alignItems: 'center',
//   justifyContent: 'center',
//   zIndex: 100000000,
//   transition: 'none',
//   background: theme => theme.background,
//   conditional: {
//     transparent: {
//       background: 'transparent',
//     },
//   },
// })
// export const SiteRoot = () => {
//   return (
//     <ProvideUI themes={themes} activeTheme="dark">
//       <OrbitToolbarChrome>hi</OrbitToolbarChrome>
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
    <StrictMode>
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
    </StrictMode>
  )
}
