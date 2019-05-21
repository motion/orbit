import { Col, Markdown } from '@o/ui'
import * as React from 'react'
import { AppBitMainProps } from '../types/AppTypes'
import { BitStatusBar } from '../views/BitStatusBar'

export function BitMarkdown(props: AppBitMainProps) {
  return (
    <Col flex={1}>
      <Col pad={{ y: true }} scrollable>
        <Markdown source={props.item.body} />
      </Col>
      <BitStatusBar {...props} />
    </Col>
  )
}
