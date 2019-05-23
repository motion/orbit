import { Col, Document } from '@o/ui'
import * as React from 'react'
import { AppBitMainProps } from '../types/AppTypes'
import { BitStatusBar } from '../views/BitStatusBar'

export function BitTask(props: AppBitMainProps) {
  return (
    <Col>
      <Col pad={{ y: true }} scrollable>
        <Document title={props.item.title} body={props.item.body} />
      </Col>
      <BitStatusBar {...props} />
    </Col>
  )
}
