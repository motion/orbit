import ButtonSrc from '!raw-loader!@o/ui/src/buttons/Button.tsx'
import { Table } from '@o/kit'
import { Button, Card, Row, SubSection } from '@o/ui'
import React from 'react'
import components from '../../tmp/components.json'
import { CodeBlock } from '../views/CodeBlock'

const buttonProps = components.find(x => x.displayName === 'Button').props

console.log('buttonProps', buttonProps)

export const Source = (
  <>
    <Card
      collapsable
      defaultCollapsed
      collapseOnClick
      title="View Source"
      maxHeight={450}
      scrollable="y"
    >
      <CodeBlock className="language-typescript">{ButtonSrc}</CodeBlock>
    </Card>

    <Card collapsable collapseOnClick title="Props" scrollable="y">
      <PropsTable props={buttonProps} />
    </Card>
  </>
)

function PropsTable(props: { props: Object }) {
  const propRows = Object.keys(props.props).reduce((acc, key) => {
    const { type, description, defaultValue, required, ...row } = props.props[key]
    // discard
    description
    acc.push({
      ...row,
      type: type.name,
      'Default Value': defaultValue === null ? '' : defaultValue,
      required,
    })
    return acc
  }, [])
  return <Table sortOrder={{ key: 'name', direction: 'down' }} height={400} rows={propRows} />
}

export const One = (
  <Row flexWrap="wrap">
    <Button>Hello World</Button>
    <Button icon="cog">Hello World</Button>
    <Button icon="cog" iconAfter>
      Hello World
    </Button>
  </Row>
)

export const Two = (
  <Row flexWrap="wrap">
    {['error', 'warn', 'confirm', 'bordered', 'selected'].map(alt => (
      <Button key={alt} alt={alt} icon="cog" iconAfter>
        Alt {alt}
      </Button>
    ))}
  </Row>
)

export const Three = (
  <Row>
    {['xs', 'sm', 'md', 'lg', 'xl', 'xxl'].map(size => (
      <Button key={size} size={size} icon="cog" iconAfter>
        Size {size}
      </Button>
    ))}
  </Row>
)

export const Four = (
  <>
    {[1, 2, 3, 4, 5].map(size => (
      <Button key={size} size={size} icon="cog" iconAfter>
        Size {size}
      </Button>
    ))}
  </>
)

export const Five = (
  <>
    {[0, 1, 2, 3, 4, 5, 6].map(elevation => (
      <SubSection title={`Elevation ${elevation}`} key={elevation}>
        <Button key={elevation} elevation={elevation} icon="cog" iconAfter>
          Hello World
        </Button>
      </SubSection>
    ))}
  </>
)
