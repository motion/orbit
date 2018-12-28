import * as React from 'react'
import { ThemeProvide, Theme } from '@mcro/gloss'
import { themes } from './themes'
import { Button, Row } from '@mcro/ui'

export const TestUI = () => {
  return (
    <ThemeProvide themes={themes}>
      <Theme name="light">
        <Button size={2} tooltip="hi hello" tooltipProps={{ open: true }}>
          test
        </Button>

        <Row position="absolute" right={0}>
          <Button
            tooltip="hi hello"
            tooltipProps={{ open: true, ref: x => (window.x = x), debug: true }}
          >
            1
          </Button>
        </Row>
      </Theme>
    </ThemeProvide>
  )
}
