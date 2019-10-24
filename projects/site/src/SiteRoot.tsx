// //!
// import { ProvideUI, View } from '@o/ui'
// //
// const React = require('react')
// const { themes } = require('./themes')
// export const SiteRoot = () => {
//   return (
//     <ProvideUI themes={themes} activeTheme="dark">
//       <View
//         key={`image-${1}`}
//         width="100%"
//         height="100%"
//         borderRadius={22}
//         boxShadow={[[0, 10, 30, [0, 0, 0]]]}
//         overflow="hidden"
//         initial="enter"
//         animate="center"
//         exit="exit"
//         transition={{
//           x: { type: 'spring', stiffness: 100, damping: 200 },
//           opacity: { duration: 0.2 },
//         }}
//         position="absolute"
//         drag="x"
//         dragConstraints={{ left: 0, right: 0 }}
//         dragElastic={1}
//         onDragEnd={() => {}}
//       >
//         hello world
//       </View>
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
