import * as React from 'react'

import { TestUI } from './TestUI'

export default function RootView() {
  console.log('rendering root')
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
}
