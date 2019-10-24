//!
import { ProvideUI } from '@o/ui'
import { Box, gloss } from 'gloss'

import { mediaQueries } from './constants'

//
const React = require('react')
const { themes } = require('./themes')
const ExampleHalf = gloss(Box, {
  position: 'relative',
  marginBottom: 20,
  borderRadius: 6,
  overflow: 'hidden',
  [mediaQueries.lg]: {
    marginBottom: 0,
  },
})

export const SiteRoot = () => {
  return (
    <ProvideUI themes={themes} activeTheme="dark">
      <ExampleHalf>hi</ExampleHalf>
    </ProvideUI>
  )
}
// import { ErrorBoundary, ProvideUI } from '@o/ui'
// import React, { StrictMode, Suspense } from 'react'
// import { Router, View } from 'react-navi'

// import { Layout } from './Layout'
// import { Navigation } from './Navigation'
// import { SiteStoreContext } from './SiteStore'
// import { themes } from './themes'

// export const SiteRoot = () => {
//   return (
//     <StrictMode>
//       <ProvideUI themes={themes} activeTheme="home">
//         <ErrorBoundary name="Site Root">
//           <SiteStoreContext.Provider>
//             {/* this key helps HMR for lazy imports... but it breaks scroll position */}
//             <Router
//               // key={process.env.NODE_ENV === 'development' ? Math.random() : 0}
//               navigation={Navigation}
//             >
//               <Layout>
//                 <Suspense fallback={null}>
//                   <View hashScrollBehavior="smooth" />
//                 </Suspense>
//               </Layout>
//             </Router>
//           </SiteStoreContext.Provider>
//         </ErrorBoundary>
//       </ProvideUI>
//     </StrictMode>
//   )
// }
