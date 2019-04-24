import { Progress, Row } from '@o/ui'
import React from 'react'

// import ProgressCircleSrc from '!raw-loader!@o/ui/src/progress/ProgressCircle.tsx'
// import Spinner from '!raw-loader!@o/ui/src/Spinner.tsx'
export let One = (
  <Row flexWrap="wrap">
    <Progress type="bar" />
    <Progress type="bar" percent={10} />
    <Progress type="circle" />
    <Progress type="circle" percent={10} />
  </Row>
)
