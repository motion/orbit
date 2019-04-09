import { Button, Section, SubTitle } from '@o/ui'
import React from 'react'

export function DocsButtons() {
  return (
    <Section flex={1} scrollable="y" title="Buttons" pad={[0, true]} titleBorder space="xl">
      <Section space size="md" title="Buttons">
        <Button>Hello World</Button>
        <Button icon="cog">Hello World</Button>
        <Button icon="cog" iconAfter>
          Hello World
        </Button>
      </Section>

      <Section space size="md" title="Sizing (preset)">
        {['xs', 'sm', 'md', 'lg', 'xl', 'xxl'].map(size => (
          <Button key={size} size={size as any} icon="cog" iconAfter>
            Size {size}
          </Button>
        ))}
      </Section>

      <Section space size="md" title="Sizing (absolute)">
        {[1, 2, 3, 4, 5].map(size => (
          <Button key={size} size={size as any} icon="cog" iconAfter>
            Size {size}
          </Button>
        ))}
      </Section>

      {[0, 1, 2, 3, 4, 5, 6].map(elevation => (
        <>
          <SubTitle>Elevation {elevation}</SubTitle>
          <Button key={elevation} elevation={elevation} size={2} icon="cog" iconAfter>
            Hello World
          </Button>
        </>
      ))}
    </Section>
  )
}
