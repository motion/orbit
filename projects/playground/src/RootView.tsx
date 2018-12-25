import * as React from 'react'
import { TestHMR } from './TestHMR'
import { themes } from './themes'
import { ThemeProvide, Theme } from '@mcro/gloss'
import { Button } from '@mcro/ui'

export const RootView = () => {
  return (
    <ThemeProvide themes={themes}>
      <Theme name="light">
        <Button size={2} tooltip="hi">
          test
        </Button>
        <TestHMR />
      </Theme>
    </ThemeProvide>
  )
}
