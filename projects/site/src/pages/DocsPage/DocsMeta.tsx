import GithubIcon from '!raw-loader!../../../public/logos/github.svg'
import { Button, Card, Col, Divider, Icon, Space, Table } from '@o/ui'
import React from 'react'
import { CodeBlock } from '../../views/CodeBlock'

export const DocsMeta = (props: { source: string; displayName: string; component?: any }) => {
  return (
    <>
      <Col space>
        <Card
          collapsable
          defaultCollapsed
          collapseOnClick
          title={`View ${props.displayName} Source`}
          afterTitle={
            <Button
              tagName="a"
              {...{ href: 'http://github.com' }}
              icon={<Icon name="github" size={18} svg={GithubIcon} />}
            />
          }
          maxHeight={450}
          scrollable="y"
        >
          <CodeBlock className="language-typescript">{props.source}</CodeBlock>
        </Card>
        <Card collapsable collapseOnClick title="Props" scrollable="y">
          <PropsTable props={props.component.props} />
        </Card>
      </Col>

      <Space size="xl" />
      <Divider />
    </>
  )
}

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
