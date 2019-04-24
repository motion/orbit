import { Progress, Row } from '@o/ui'
import React from 'react'

export let Simple = (
  <Row flexWrap="wrap">
    <Progress type="bar" />
    <Progress type="bar" percent={10} />
    <Progress type="circle" />
    <Progress type="circle" percent={10} />
  </Row>
)
