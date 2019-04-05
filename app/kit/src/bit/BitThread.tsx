import { Col, Thread, Title } from '@o/ui'
import * as React from 'react'
import { BitStatusBar } from '../views/BitStatusBar'

export function BitThread({ item }) {
  return (
    <Col flex={1}>
      <Col padY scrollable>
        <Title>{item.title}</Title>
        <Thread {...item} />
      </Col>
      <BitStatusBar {...this.props} />
    </Col>
  )
}
