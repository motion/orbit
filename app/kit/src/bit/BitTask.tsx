import { Col, Document } from '@o/ui'
import * as React from 'react'
import { BitStatusBar } from '../views/BitStatusBar'

export function BitTask({ item }) {
  return (
    <Col>
      <Col padY scrollable>
        <Document {...this.props}>{item.body}</Document>
      </Col>
      <BitStatusBar {...this.props} />
    </Col>
  )
}
