import { Button, Card, FloatingCard, Stack } from '@o/ui'
import React, { useState } from 'react'

const ExampleCard = ({ children = 'Hello world', ...props }) => (
  <Card title="Title" subTitle="SubTitle" padding width={180} icon="cog" iconBefore {...props}>
    {children}
  </Card>
)

export let Basic = (
  <Stack direction="horizontal" space flexWrap="wrap">
    <ExampleCard>hello world</ExampleCard>
    <ExampleCard title="Elevation = 2" elevation={2} />
    <ExampleCard coat="warn" location="warn" title="Coat = warn" elevation={4} />
    <ExampleCard badge="1" coat="confirm" title="Coat = confirm" elevation={4} />
    <ExampleCard width={300} height={300} location="hi" badge="1" size="lg" title="Size LG">
      hello world
    </ExampleCard>
    <ExampleCard width={300} height={300} location="hi" badge="1" size="xl" title="Size XL">
      hello world
    </ExampleCard>
  </Stack>
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
      <Stack padding>
        <Button coat="action" size="lg" onClick={() => setShow(!show)}>
          Toggle Floating Card
        </Button>
      </Stack>
      <FloatingCard
        visible={show}
        title="Floating Card"
        subTitle="Sub Title"
        width={300}
        height={200}
        attach="bottom right"
        bounds={{ top: 20, left: 20, right: 20, bottom: 20 }}
        coat="warn"
        location="warn"
        elevation={4}
      >
        Hello World
      </FloatingCard>
    </>
  )
}
