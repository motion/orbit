import { Button, Col, Row, useBanner } from '@o/ui'
import React, { useEffect, useState } from 'react'

export let Basic = () => {
  const banner = useBanner()

  return (
    <Col space>
      <Row group flexWrap="wrap">
        <Button
          onClick={() => {
            console.log('call with info')
            banner.set({
              title: 'Info',
              message: `Lorem ipsum dolor sit info`,
              type: 'info',
            })
          }}
        >
          Show Info Banner
        </Button>
        <Button
          onClick={() => {
            banner.set({
              title: 'Warning',
              message: `Lorem ipsum dolor sit warning`,
              type: 'warn',
            })
          }}
          alt="warn"
        >
          Show Warning Banner
        </Button>
        <Button
          onClick={() => {
            banner.set({
              title: 'Error',
              message: `Lorem ipsum dolor sit error`,
              type: 'error',
            })
          }}
          alt="error"
        >
          Show Error Banner
        </Button>
      </Row>
      <Row space flexWrap="wrap">
        <Button
          onClick={() => {
            banner.set({
              title: 'I will timeout',
              message: `Lorem ipsum dolor sit error`,
              type: 'info',
              timeout: 2,
            })
          }}
        >
          Show Timeout Banner (2s)
        </Button>
      </Row>
    </Col>
  )
}
