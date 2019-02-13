import { Theme, ThemeProvide } from '@mcro/gloss'
import * as React from 'react'
import { hot } from 'react-hot-loader'
import { TestStores } from './TestStores'
import { themes } from './themes'

export default hot(module)(function RootView() {
  return (
    <ThemeProvide themes={themes}>
      <Theme name="light">
        {/* <TestUI /> */}
        {/* <TestHMR /> */}
        <TestStores />
      </Theme>
    </ThemeProvide>
  )
})
