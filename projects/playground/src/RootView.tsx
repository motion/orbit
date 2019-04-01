import * as React from 'react'
import { hot } from 'react-hot-loader/root'
import { TestUIKit } from './TestUI/TestUIKit'

export default hot(function RootView() {
  return (
    <>
      {/* <TestUI /> */}
      {/* <TestHMR /> */}
      {/* <TestStores /> */}
      <TestUIKit />
    </>
  )
})
