import { Button, Row, SubSection } from '@o/ui'
import React from 'react'

export let Basic = (
  <Row space flexWrap="wrap">
    <Button>Hello World</Button>
    <Button icon="cog">Hello World</Button>
    <Button icon="cog" iconAfter>
      Hello World
    </Button>
  </Row>
)

export let Alternates = (
  <Row space flexWrap="wrap">
    {['error', 'warn', 'confirm', 'bordered', 'selected'].map(alt => (
      <Button key={alt} alt={alt} icon="cog" iconAfter>
        Alt {alt}
      </Button>
    ))}
  </Row>
)

export let Sizing = (
  <Row space>
    {['xs', 'sm', 'md', 'lg', 'xl', 'xxl'].map(size => (
      <Button key={size} size={size} icon="cog" iconAfter>
        Size {size}
      </Button>
    ))}
  </Row>
)

export let Elevation = (
  <>
    {[0, 1, 2, 3, 4, 5].map(i => (
      <SubSection title={`Elevation ${i}, Size ${i + 1}`} key={i}>
        <Button key={i} size={i + 1} elevation={i} icon="cog" iconAfter>
          Hello World
        </Button>
      </SubSection>
    ))}
  </>
)

export let Group = (
  <Row group>
    <Button>Hello</Button>
    <Button>World</Button>
  </Row>
)
