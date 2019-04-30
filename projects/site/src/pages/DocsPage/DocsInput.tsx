import { Button, Col, Input, PassProps, Row, SurfacePassProps } from '@o/ui'
import React from 'react'

export let Basic = (
  <Col space>
    <Input
      type="email"
      name="email"
      placeholder="Hello world"
      onChange={e => console.log(e.target.value)}
    />
    <Input icon="search" />
  </Col>
)

export let Sized = (
  <Input
    size={2}
    sizeRadius={3}
    sizePadding={2}
    borderWidth={2}
    icon="book"
    placeholder="Hello world"
    onChange={e => console.log(e.target.value)}
    after="hi"
  />
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
      <PassProps size="xl">
        <Input placeholder="Hello world" />
        <Button>Submit</Button>
      </PassProps>
    </Row>
    <SurfacePassProps size={1.5} sizeRadius={2}>
      <Row group>
        <Button background="transparent" icon="search" />
        <Input placeholder="Hello world" />
        <Button>Submit</Button>
      </Row>
    </SurfacePassProps>
  </Col>
)
