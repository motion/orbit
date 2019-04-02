import { Col } from '@o/gloss'
import { Button, Popover, Row } from '@o/ui'
import * as React from 'react'

export function TestUIPopovers() {
  return (
    <Row flex={1} overflow="hidden" height="100%">
      <Col width={200} overflowY="auto">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => (
          <Row padding={20} height={200} key={i} borderBottom={[1, 'grey']} alignItems="center">
            <Col flex={1}>hello</Col>
            <Popover
              open={i === 3}
              towards="right"
              width={250}
              height={300}
              target={<Col>***</Col>}
              openOnClick
              closeOnClickAway
              background
              borderRadius={10}
              elevation={1}
            >
              <Col width={100} height={200} background="red" />
            </Popover>
          </Row>
        ))}
      </Col>
      <Button size={2} tooltip="hi hello" tooltipProps={{ open: true }}>
        test
      </Button>

      <Row position="absolute" right={0}>
        <Button tooltip="hi hello">1</Button>
      </Row>
    </Row>
  )
}
