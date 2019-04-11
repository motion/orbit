import ButtonSrc from '!raw-loader!@o/ui/src/buttons/Button.tsx'
import { Button, Row, SubSection } from '@o/ui'
import React from 'react'
import { DocsMeta } from './DocsMeta'

export let Source = <DocsMeta source={ButtonSrc} displayName="Button" />

export let One = (
  <Row flexWrap="wrap">
    <Button>Hello World</Button>
    <Button icon="cog">Hello World</Button>
    <Button icon="cog" iconAfter>
      Hello World
    </Button>
  </Row>
)

export let Two = (
  <Row flexWrap="wrap">
    {['error', 'warn', 'confirm', 'bordered', 'selected'].map(alt => (
      <Button key={alt} alt={alt} icon="cog" iconAfter>
        Alt {alt}
      </Button>
    ))}
  </Row>
)

export let Three = (
  <Row>
    {['xs', 'sm', 'md', 'lg', 'xl', 'xxl'].map(size => (
      <Button key={size} size={size} icon="cog" iconAfter>
        Size {size}
      </Button>
    ))}
  </Row>
)

export let Four = (
  <>
    {[0, 1, 2, 3, 4, 5, 6].map(i => (
      <SubSection title={`Elevation ${i}, Size ${i}`} key={i}>
        <Button key={i} size={i} elevation={i} icon="cog" iconAfter>
          Hello World
        </Button>
      </SubSection>
    ))}
  </>
)