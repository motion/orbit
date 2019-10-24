// //!
// import { gloss, ProvideUI, View } from '@o/ui'
// //
// const React = require('react')
// const { themes } = require('./themes')
// const FlexView = gloss(View, {
//   position: 'relative',
//   flex: 1,
// })
// export const SiteRoot = () => {
//   return (
//     <ProvideUI themes={themes} activeTheme="dark">
//       <FlexView flex={2} alignItems="center" position="relative" margin={0} sm-margin={[0, '-5%']}>
//         hello
//       </FlexView>
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
