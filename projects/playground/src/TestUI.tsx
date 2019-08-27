import { Button, CardSimple, Col, Row } from '@o/ui'
import _ from 'lodash'
import * as React from 'react'

import { TestUIEditor } from './TestUI/TestUIEditor'

export function TestUI() {
  return (
    <Row flex={1} overflow="hidden" height="100%">
      {/* <TestUIPopovers /> */}
      {/* <TestUIGlossSpeed /> */}
      <TestUIEditor />
    </Row>
  )
}

export function TestUIGlossSpeed() {
  const [key, setKey] = React.useState(0)
  return (
    <Col space>
      <Button onClick={() => setKey(key + 1)}>render</Button>
      <Col space>
        {_.fill(new Array(150), 0).map((_, index) => (
          <CardSimple key={index} title={`card ${index}`}>
            lorem ipsume sit amet
          </CardSimple>
        ))}
      </Col>
    </Col>
  )
}
