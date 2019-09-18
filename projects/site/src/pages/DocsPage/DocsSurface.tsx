import { Row, SizedSurface, SubSection, SurfacePassProps } from '@o/ui'
import React from 'react'

export let Basic = (
  <Row space flexWrap="wrap">
    <SizedSurface>Hello World</SizedSurface>
    <SizedSurface icon="cog">Hello World</SizedSurface>
    <SizedSurface icon="cog" iconAfter>
      Hello World
    </SizedSurface>
  </Row>
)

export let Coats = (
  <Row space flexWrap="wrap">
    {['error', 'warn', 'confirm', 'bordered', 'selected'].map(alt => (
      <SizedSurface key={alt} coat={alt} icon="cog" iconAfter>
        Alt {alt}
      </SizedSurface>
    ))}
  </Row>
)

export let Sizing = (
  <Row space flexWrap="wrap">
    {['xs', 'sm', 'md', 'lg', 'xl', 'xxl', 1, 2, 3].map(size => (
      <SizedSurface key={size} size={size} icon="cog" iconAfter>
        Size {size}
      </SizedSurface>
    ))}
  </Row>
)

export let Elevation = (
  <Row space flexWrap="wrap">
    {[2, 3, 4, 5].map(i => (
      <SubSection title={`Elevation ${i}, Size ${i}`} key={i}>
        <SizedSurface key={i} size={i} elevation={i} icon="cog" iconAfter>
          {i}
        </SizedSurface>
      </SubSection>
    ))}
  </Row>
)

export let Group = (
  <Row group>
    <SizedSurface>Hello</SizedSurface>
    <SizedSurface>World</SizedSurface>
  </Row>
)

export let PassMultipleProps = (
  <SurfacePassProps icon="home" coat="action" size="lg">
    <Row space>
      <SizedSurface>Hello</SizedSurface>
      <SizedSurface>World</SizedSurface>
    </Row>
  </SurfacePassProps>
)

export let SizingProps = (
  <SizedSurface size={2} sizePadding={3} sizeRadius={3} sizeHeight={2} sizeIcon={0.75} icon="home">
    Hello
  </SizedSurface>
)
