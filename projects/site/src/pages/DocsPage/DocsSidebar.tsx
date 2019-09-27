import { Center, Col, Sidebar, SubTitle } from '@o/ui'
import React from 'react'

export let Basic = (
  <Col height={500}>
    <Sidebar>
      <Center onClick={() => console.warn('got click')}>
        <SubTitle>Hello World</SubTitle>
      </Center>
    </Sidebar>
  </Col>
)
