import { Theme, ThemeProvide } from '@o/gloss'
import * as React from 'react'
import { hot } from 'react-hot-loader'
import { TestUI } from './TestUI'
import { themes } from './themes'

export default hot(module)(function RootView() {
  return (
    <ThemeProvide themes={themes}>
      <Theme name="light">
        <TestUI />
        {/* <TestHMR /> */}
        {/* <TestStores /> */}
      </Theme>
    </ThemeProvide>
  )
})
