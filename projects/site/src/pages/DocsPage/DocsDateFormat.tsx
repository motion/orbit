import { DateFormat, Stack } from '@o/ui'
import React from 'react'

export let Basic = (
  <Stack space>
    <DateFormat date={new Date()} />
    <DateFormat
      date={(() => {
        const d = new Date()
        d.setDate(d.getDate() - 2)
        return d
      })()}
    />
    <DateFormat
      date={(() => {
        const d = new Date()
        d.setDate(d.getDate() - 31)
        return d
      })()}
    />
    <DateFormat
      date={(() => {
        const d = new Date()
        d.setDate(d.getDate() - 365)
        return d
      })()}
    />
  </Stack>
)
