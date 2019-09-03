import { Button, Col, Row, useBanner, useBanners } from '@o/ui'
import React, { useRef } from 'react'

export let Basic = () => {
  // single banner that replaces
  const banner = useBanner()
  // create as many as you need
  const banners = useBanners()
  const count = useRef(0)

  return (
    <Col space>
      <Row space flexWrap="wrap">
        <Button
          alt="info"
          onClick={() => {
            banner.set({
              message: `I don't have a title`,
              type: 'info',
            })
          }}
        >
          Replace Info Banner
        </Button>
        <Button
          alt="warn"
          onClick={() => {
            banner.set({
              title: 'Warning',
              message: `Lorem ipsum dolor sit warning`,
              type: 'warn',
            })
          }}
        >
          Replace Warning Banner
        </Button>
        <Button
          alt="error"
          onClick={() => {
            banner.set({
              title: 'Error',
              message: `Lorem ipsum dolor sit error`,
              type: 'error',
            })
          }}
        >
          Replace Error Banner
        </Button>
      </Row>
      <Row space flexWrap="wrap">
        <Button
          onClick={() => {
            count.current++
            banners.show({
              title: 'I will timeout',
              message: `I am banner number ${count.current}`,
              type: 'info',
              timeout: 2,
            })
          }}
        >
          Add Timeout Banner (2s)
        </Button>
      </Row>
    </Col>
  )
}
