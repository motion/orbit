import * as React from 'react'
import { Row } from '@mcro/ui'
import { gloss } from '@mcro/gloss'

export const HomeAppMain = React.memo(() => {
  return (
    <Row flex={1} padding={20} overflowX="auto">
      <FakeSection />
      <FakeSection />
      <FakeSection />
      <FakeSection />
    </Row>
  )
})

const FakeSection = gloss({
  width: 400,
  height: '100%',
  borderRadius: 10,
  background: '#f2f2f2',
  marginRight: 20,
})
