import ButtonSrc from '!raw-loader!@o/ui/src/buttons/Button.tsx'
import { Button, Card, Section, SubSection } from '@o/ui'
import React from 'react'
import { CodeBlock } from '../views/CodeBlock'

export const Source = () => (
  <Card collapsable defaultCollapsed title="View Source">
    <CodeBlock className="language-typescript">{ButtonSrc}</CodeBlock>
  </Card>
)

export const One = () => (
  <>
    <Button>Hello World</Button>
    <Button icon="cog">Hello World</Button>
    <Button icon="cog" iconAfter>
      Hello World
    </Button>
  </>
)

export const Two = () => (
  <Section space size="md">
    {['error', 'warn', 'confirm', 'bordered', 'selected'].map(alt => (
      <Button key={alt} alt={alt} icon="cog" iconAfter>
        Alt {alt}
      </Button>
    ))}
  </Section>
)

export const Three = () => (
  <Section space size="md">
    {['xs', 'sm', 'md', 'lg', 'xl', 'xxl'].map(size => (
      <Button key={size} size={size} icon="cog" iconAfter>
        Size {size}
      </Button>
    ))}
  </Section>
)

export const Four = () => (
  <Section space size="md">
    {[1, 2, 3, 4, 5].map(size => (
      <Button key={size} size={size} icon="cog" iconAfter>
        Size {size}
      </Button>
    ))}
  </Section>
)

export const Five = () => (
  <div>
    {[0, 1, 2, 3, 4, 5, 6].map(elevation => (
      <SubSection title={`Elevation ${elevation}`} key={elevation}>
        <Button key={elevation} elevation={elevation} size={2} icon="cog" iconAfter>
          Hello World
        </Button>
      </SubSection>
    ))}
  </div>
)
