import { Button, Card, Col, FloatingCard, Row } from '@o/ui'
import React, { useState } from 'react'

const ExampleCard = ({ children = 'Hello world content', ...props }) => (
  <Card title="Title" subTitle="SubTitle" padding width={180} icon="cog" iconBefore {...props}>
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
  <Card title="Title" padding width={180} iconBefore collapsable>
    Hello World
  </Card>
)

export let Floating = () => {
  const [show, setShow] = useState(false)
  return (
    <>
      <Col padding>
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
        attach="bottom right"
        bounds={{ top: 20, left: 20, right: 20, bottom: 20 }}
        alt="warn"
        location="warn"
        elevation={4}
      >
        Hello World
      </FloatingCard>
    </>
  )
}
