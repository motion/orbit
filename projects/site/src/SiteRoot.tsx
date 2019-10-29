//!
import { ProvideUI } from '@o/ui'
import { Box, gloss } from 'gloss'
import { useState } from 'react'

//
const React = require('react')
const { themes } = require('./themes')
const AccidentalScrollPrevent = gloss<any>(Box, {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: [150, 150, 150, 0.1],
  zIndex: 10,

  conditional: {
    disallowScroll: {
      opacity: 0,
      pointerEvents: 'none',
    },
  },
})

export const SiteRoot = () => {
  const [x] = useState(false)
  return (
    <ProvideUI themes={themes} activeTheme="dark">
      <AccidentalScrollPrevent disallowScroll={x}>hi</AccidentalScrollPrevent>
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
