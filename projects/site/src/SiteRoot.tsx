//!
import { ProvideUI, selectDefined, Space } from '@o/ui'

//
const React = require('react')
const { themes } = require('./themes')
// const TextFitTitle = gloss(SimpleText, {
//   userSelect: 'text',
//   lineHeight: '95%',
//   fontSize: `${6}vw`,
//   'sm-fontSize': 6 * 11.5,
// })
export const SiteRoot = () => {
  return (
    <ProvideUI themes={themes} activeTheme="dark">
      <Space size={selectDefined(10, 2 * 6)} />
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
