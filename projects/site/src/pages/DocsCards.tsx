import CardSrc from '!raw-loader!@o/ui/src/Card.tsx'
import { Card, Row, SubSection } from '@o/ui'
import React from 'react'
import { DocsMeta } from './DocsMeta'

export let Source = <DocsMeta source={CardSrc} displayName="Card" />

const ExampleCard = ({ children = 'Hello world content', ...props }) => (
  <Card
    title="Title"
    subTitle="SubTitle"
    pad
    width={180}
    height={250}
    icon="cog"
    iconBefore
    {...props}
  >
    {children}
  </Card>
)

export let One = (
  <Row flexWrap="wrap">
    <ExampleCard>hello worl2</ExampleCard>
    <ExampleCard title="Elevation = 2" elevation={2} />
    <ExampleCard alt="warn" title="Alt = warn" elevation={4} />
    <ExampleCard alt="confirm" title="Alt = confirm" elevation={4} />
    <ExampleCard size="xl" title="Size XL">
      hello worl2
    </ExampleCard>
  </Row>
)

export let Two = (
  <Row flexWrap="wrap">
    {['error', 'warn', 'confirm', 'bordered', 'selected'].map(alt => (
      <Card key={alt} alt={alt} icon="cog" iconAfter>
        Alt {alt}
      </Card>
    ))}
  </Row>
)

export let Three = (
  <Row>
    {['xs', 'sm', 'md', 'lg', 'xl', 'xxl'].map(size => (
      <Card key={size} size={size} icon="cog" iconAfter>
        Size {size}
      </Card>
    ))}
  </Row>
)

export let Four = (
  <>
    {[0, 1, 2, 3, 4, 5, 6].map(i => (
      <SubSection title={`Elevation ${i}, Size ${i}`} key={i}>
        <Card key={i} size={i} elevation={i} icon="cog" iconAfter>
          Hello World
        </Card>
      </SubSection>
    ))}
  </>
)
