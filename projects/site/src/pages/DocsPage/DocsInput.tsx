import { Button, Col, Input, PassProps, Row, SurfacePassProps } from '@o/ui'
import React from 'react'

export let Basic = (
  <Col space>
    <Input placeholder="Hello world" onChange={e => console.log(e.target.value)} />
    <Input icon="search" />
  </Col>
)

export let Sized = (
  <>
    <Input
      size={2}
      sizeRadius={3}
      icon="book"
      placeholder="Hello world"
      onChange={e => console.log(e.target.value)}
      after="hi"
    />
  </>
)

export let Grouped = (
  <Row group>
    <Input placeholder="Hello world" onChange={e => console.log(e.target.value)} />
    <Button>Submit</Button>
  </Row>
)

export let GroupedSized = (
  <Col space>
    <Row group>
      <PassProps size={1.5}>
        <Input placeholder="Hello world" onChange={e => console.log(e.target.value)} />
        <Button>Submit</Button>
      </PassProps>
    </Row>

    <SurfacePassProps size={1.5} sizeRadius={2}>
      <Row group>
        <Input placeholder="Hello world" onChange={e => console.log(e.target.value)} />
        <Button>Submit</Button>
      </Row>
    </SurfacePassProps>
  </Col>
)
