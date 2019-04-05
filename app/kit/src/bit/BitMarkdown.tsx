import { Col, Markdown } from '@o/ui'
import * as React from 'react'
import { BitStatusBar } from '../views/BitStatusBar'

export function BitMarkdown({ item }) {
  return (
    <Col pad flex={1}>
      <Col padY="y">
        <Markdown {...this.props}>{item.body}</Markdown>
      </Col>
      <BitStatusBar {...this.props} />
    </Col>
  )
}
