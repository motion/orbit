import * as React from 'react'
import { ThemeProvide, Theme } from '@mcro/gloss'
import { themes } from './themes'
import { Button } from '@mcro/ui'

export const TestUI = () => {
  return (
    <ThemeProvide themes={themes}>
      <Theme name="light">
        <Button size={2} tooltip="hi hello" tooltipProps={{ open: true }}>
          test
        </Button>
      </Theme>
    </ThemeProvide>
  )
}
