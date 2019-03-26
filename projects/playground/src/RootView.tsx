import { Theme, ThemeProvide } from '@o/gloss'
import { themes } from '@o/kit'
import * as React from 'react'
import { hot } from 'react-hot-loader'
import { TestUIKit } from './TestUI/TestUIKit'

export default hot(module)(function RootView() {
  return (
    <ThemeProvide themes={themes}>
      <Theme name="light">
        {/* <TestUI /> */}
        {/* <TestHMR /> */}
        {/* <TestStores /> */}
        <TestUIKit />
      </Theme>
    </ThemeProvide>
  )
})
