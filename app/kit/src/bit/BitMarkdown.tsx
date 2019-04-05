import { Col, Markdown } from '@o/ui'
import * as React from 'react'
import { BitStatusBar } from '../views/BitStatusBar'

export function BitMarkdown({ item }) {
  return (
    <Col flex={1}>
      <Col padY scrollable>
        <Markdown {...this.props}>{item.body}</Markdown>
      </Col>
      <BitStatusBar {...this.props} />
    </Col>
  )
}
