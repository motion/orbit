import { Button, Row, SubSection, SurfacePassProps } from '@o/ui'
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
  <Row space flexWrap="wrap">
    {['xs', 'sm', 'md', 'lg', 'xl', 'xxl', 1, 2, 3].map(size => (
      <Button key={size} size={size} icon="cog" iconAfter>
        Size {size}
      </Button>
    ))}
  </Row>
)

export let Elevation = (
  <Row space flexWrap="wrap">
    {[2, 3, 4, 5].map(i => (
      <SubSection title={`Elevation ${i}, Size ${i}`} key={i}>
        <Button key={i} size={i} elevation={i} icon="cog" iconAfter>
          {i}
        </Button>
      </SubSection>
    ))}
  </Row>
)

export let Group = (
  <Row group>
    <Button>Hello</Button>
    <Button>World</Button>
  </Row>
)

export let PassMultipleProps = (
  <SurfacePassProps icon="home" alt="action" size="lg">
    <Row space>
      <Button>Hello</Button>
      <Button>World</Button>
    </Row>
  </SurfacePassProps>
)

export let SizingProps = (
  <Button size={2} sizePadding={3} sizeRadius={3} sizeHeight={2} sizeIcon={0.75} icon="home">
    Hello
  </Button>
)
