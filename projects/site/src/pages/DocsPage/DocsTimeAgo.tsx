import { Stack, TimeAgo } from '@o/ui'
import React from 'react'

export let Basic = (
  <Stack space>
    <TimeAgo date={new Date()} />
    <TimeAgo
      date={(() => {
        const d = new Date()
        d.setDate(d.getDate() - 2)
        return d
      })()}
    />
    <TimeAgo
      date={(() => {
        const d = new Date()
        d.setDate(d.getDate() - 31)
        return d
      })()}
    />
    <TimeAgo
      date={(() => {
        const d = new Date()
        d.setDate(d.getDate() - 365)
        return d
      })()}
    />
  </Stack>
)
