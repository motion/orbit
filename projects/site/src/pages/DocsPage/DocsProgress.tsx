import { Progress, Stack } from '@o/ui'
import React from 'react'

export let Simple = (
  <Stack direction="horizontal" flexWrap="wrap">
    <Progress type="bar" />
    <Progress type="bar" percent={10} />
    <Progress type="circle" />
    <Progress type="circle" percent={10} />
  </Stack>
)
