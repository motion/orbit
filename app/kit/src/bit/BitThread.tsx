import { Col, Thread, Title } from '@o/ui'
import * as React from 'react'
import { AppBitMainProps } from '../types/AppTypes'
import { BitStatusBar } from '../views/BitStatusBar'

export function BitThread(props: AppBitMainProps) {
  return (
    <Col flex={1}>
      <Col pad={{ y: true }} scrollable>
        <Title>{props.item.title}</Title>
        <Thread body={props.item.body} messages={props.item.data.messages} />
      </Col>
      <BitStatusBar {...props} />
    </Col>
  )
}
