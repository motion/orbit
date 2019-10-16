//!
import { ProvideUI, SimpleText } from '@o/ui'
import { gloss } from 'gloss'
import React from 'react'

import { themes } from './themes'

const titleSize = 9
const TextFitTitle = gloss(SimpleText, {
  userSelect: 'text',
  lineHeight: '95%',
  fontSize: `${titleSize}vw`,
  // TODO
  'lg-fontSize': titleSize * 11.5,
})

export const SiteRoot = () => {
  return (
    <ProvideUI themes={themes} activeTheme="light">
      <TextFitTitle>hello world</TextFitTitle>
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

// //!
// // import { ProvideUI, SimpleText } from '@o/ui'
// // import { gloss } from 'gloss'
// // import React from 'react'
// // import { themes } from './themes'

// // const titleSize = 9
// // const TextFitTitle = gloss(SimpleText, {
// //   userSelect: 'text',
// //   lineHeight: '95%',
// //   fontSize: `${titleSize}vw`,
// //   'lg-fontSize': titleSize * 11.5,
// // })

// // export const SiteRoot = () => {
// //   return (
// //     <ProvideUI themes={themes} activeTheme="light">
// //       <TextFitTitle>hello world</TextFitTitle>
// //     </ProvideUI>
// //   )
// // }

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
