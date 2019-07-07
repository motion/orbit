import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { TestCarousel } from './TestCarousel'

export default hot(function RootView() {
  return (
    <>
      {/* <TestUI /> */}
      {/* <TestHMR /> */}
      {/* <TestStores /> */}
      {/* <TestMiniApps /> */}
      {/* <TestUIKitchenSink /> */}
      {/* <IconShape name="flow" /> */}
      <TestCarousel />
    </>
  )
})
