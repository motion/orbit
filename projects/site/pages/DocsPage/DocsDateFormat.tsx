import { Col, DateFormat } from '@o/ui'
import React from 'react'

export let Basic = (
  <Col space>
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
  </Col>
)
