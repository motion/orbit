import { Button, Card, Col, FloatingCard, Row, useWindowSize } from '@o/ui'
import React, { useState } from 'react'

const ExampleCard = ({ children = 'Hello world content', ...props }) => (
  <Card title="Title" subTitle="SubTitle" pad width={180} icon="cog" iconBefore {...props}>
    {children}
  </Card>
)

export let Basic = (
  <Row space flexWrap="wrap">
    <ExampleCard>hello worl2</ExampleCard>
    <ExampleCard title="Elevation = 2" elevation={2} />
    <ExampleCard alt="warn" location="warn" title="Alt = warn" elevation={4} />
    <ExampleCard badge="1" alt="confirm" title="Alt = confirm" elevation={4} />
    <ExampleCard width={300} height={300} location="hi" badge="1" size="lg" title="Size LG">
      hello worl2
    </ExampleCard>
    <ExampleCard width={300} height={300} location="hi" badge="1" size="xl" title="Size XL">
      hello worl2
    </ExampleCard>
  </Row>
)

export let Collapsable = (
  <Card title="Title" pad width={180} iconBefore collapsable>
    Hello World
  </Card>
)

export let Floating = () => {
  const [show, setShow] = useState(false)
  return (
    <>
      <Col pad>
        <Button alt="action" size="lg" onClick={() => setShow(!show)}>
          Toggle Floating Card
        </Button>
      </Col>
      <FloatingCard
        visible={show}
        title="Floating Card"
        subTitle="Sub Title"
        width={300}
        height={200}
        usePosition={() => useWindowSize({ adjust: ([x, y]) => [x - 300, y - 200] })}
        alt="warn"
        location="warn"
        elevation={4}
      >
        Hello World
      </FloatingCard>
    </>
  )
}
