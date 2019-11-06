//!
import { Paragraph, ProvideUI } from '@o/ui'
import { gloss } from 'gloss'

const P2 = gloss(Paragraph, {
  color: 'red',
  fontSize: 25,
  conditional: {
    bigger: {
      fontSize: 200,
    },
  },
})
//
const React = require('react')
const { themes } = require('./themes')
export const SiteRoot = () => {
  return (
    <ProvideUI themes={themes} activeTheme="dark">
      <P2
        tagName="div"
        display="flex"
        flexDirection="row"
        color="green"
        size={1.1}
        alpha={0.65}
        fontWeight={400}
        sizeLineHeight={1.2}
      >
        123
      </P2>
      <P2 bigger>123</P2>
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
//     <ProvideUI themes={themes} activeTheme="home">
//       <ErrorBoundary name="Site Root">
//         <SiteStoreContext.Provider>
//           {/* this key helps HMR for lazy imports... but it breaks scroll position */}
//           <Router
//             // key={process.env.NODE_ENV === 'development' ? Math.random() : 0}
//             navigation={Navigation}
//           >
//             <Layout>
//               <Suspense fallback={null}>
//                 <View hashScrollBehavior="smooth" />
//               </Suspense>
//             </Layout>
//           </Router>
//         </SiteStoreContext.Provider>
//       </ErrorBoundary>
//     </ProvideUI>
//   )
// }
