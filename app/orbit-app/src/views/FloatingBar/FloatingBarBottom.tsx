import { Absolute, Row } from '@mcro/ui'
import * as React from 'react'

export function FloatingBarBottom(props: { children: any }) {
  return (
    <Absolute bottom={16} left={16} right={16} zIndex={100000}>
      <Row>{props.children}</Row>
    </Absolute>
  )
}
