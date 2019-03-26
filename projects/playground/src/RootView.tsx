import * as React from 'react'
import { hot } from 'react-hot-loader'
import { TestUIKit } from './TestUI/TestUIKit'

export default hot(module)(function RootView() {
  return (
    <>
      {/* <TestUI /> */}
      {/* <TestHMR /> */}
      {/* <TestStores /> */}
      <TestUIKit />
    </>
  )
})
