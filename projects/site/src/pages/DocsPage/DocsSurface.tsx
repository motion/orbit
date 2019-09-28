import { SizedSurface, Stack, SubSection, SurfacePassProps } from '@o/ui'
import React from 'react'

export let Basic = (
  <Stack direction="horizontal" space flexWrap="wrap">
    <SizedSurface>Hello World</SizedSurface>
    <SizedSurface icon="cog">Hello World</SizedSurface>
    <SizedSurface icon="cog" iconAfter>
      Hello World
    </SizedSurface>
  </Stack>
)

export let Coats = (
  <Stack direction="horizontal" space flexWrap="wrap">
    {['error', 'warn', 'confirm', 'bordered', 'selected'].map(coat => (
      <SizedSurface key={coat} coat={coat} icon="cog" iconAfter>
        Coat {coat}
      </SizedSurface>
    ))}
  </Stack>
)

export let Sizing = (
  <Stack direction="horizontal" space flexWrap="wrap">
    {['xs', 'sm', 'md', 'lg', 'xl', 'xxl', 1, 2, 3].map(size => (
      <SizedSurface key={size} size={size} icon="cog" iconAfter>
        Size {size}
      </SizedSurface>
    ))}
  </Stack>
)

export let Elevation = (
  <Stack direction="horizontal" space flexWrap="wrap">
    {[2, 3, 4, 5].map(i => (
      <SubSection title={`Elevation ${i}, Size ${i}`} key={i}>
        <SizedSurface key={i} size={i} elevation={i} icon="cog" iconAfter>
          {i}
        </SizedSurface>
      </SubSection>
    ))}
  </Stack>
)

export let Group = (
  <Stack direction="horizontal" group>
    <SizedSurface>Hello</SizedSurface>
    <SizedSurface>World</SizedSurface>
  </Stack>
)

export let PassMultipleProps = (
  <SurfacePassProps icon="home" coat="action" size="lg">
    <Stack direction="horizontal" space>
      <SizedSurface>Hello</SizedSurface>
      <SizedSurface>World</SizedSurface>
    </Stack>
  </SurfacePassProps>
)

export let SizingProps = (
  <SizedSurface size={2} sizePadding={3} sizeRadius={3} sizeHeight={2} sizeIcon={0.75} icon="home">
    Hello
  </SizedSurface>
)
