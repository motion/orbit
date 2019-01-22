import { Absolute, Row } from '@mcro/ui'
import * as React from 'react'

export function TopControls(props: { children: any }) {
  return (
    <Absolute top={8} right={16} left={16} zIndex={100000}>
      <Row>{props.children}</Row>
    </Absolute>
  )
}
