import * as React from 'react'
import { hot } from 'react-hot-loader/root'
import { TestUIKitchenSink } from './TestUI/TestUIKitchenSink'

export default hot(function RootView() {
  return (
    <>
      {/* <TestUI /> */}
      {/* <TestHMR /> */}
      {/* <TestStores /> */}
      {/* <TestMiniApps /> */}
      <TestUIKitchenSink />
    </>
  )
})
