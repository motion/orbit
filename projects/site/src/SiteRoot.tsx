//!
const { ProvideUI, Absolute, SimpleText } = require('@o/ui')
const { gloss } = require('gloss')
const React = require('react')
const { themes } = require('./themes')
const titleSize = 9
const TextFitTitle = gloss(SimpleText, {
  userSelect: 'text',
  lineHeight: '95%',
  fontSize: `${titleSize}vw`,
  // TODO
  'sm-fontSize': titleSize * 11.5,
})
export const SiteRoot = () => {
  return (
    <ProvideUI themes={themes} activeTheme="light">
      <Absolute
        background="red"
        top={0}
        left={0}
        bottom={0}
        right={0}
        alignItems="center"
        justifyContent="center"
        debug
      >
        <TextFitTitle>hello world</TextFitTitle>
      </Absolute>
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
