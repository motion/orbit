import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { TestUI } from './TestUI'

export default hot(function RootView() {
  return (
    <>
      <TestUI />
      {/* <TestHMR /> */}
      {/* <TestStores /> */}
      {/* <TestMiniApps /> */}
      {/* <TestUIKitchenSink /> */}
      {/* <IconShape name="flow" /> */}
      {/* <TestCarousel /> */}
    </>
  )
})
