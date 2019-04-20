import GithubIcon from '!raw-loader!../../public/logos/github.svg'
import { Button, Card, Icon, Row, Section, Space, SurfacePassProps, Table } from '@o/ui'
import React, { memo } from 'react'

import { scrollTo } from '../etc/helpers'
import { CodeBlock } from '../views/CodeBlock'
import { MetaSection } from './DocsPage'
import { useScreenVal } from './HomePage/SpacedPageContent'

export const DocsContents = memo(({ title, source, children, types }: any) => {
  return (
    <Section
      maxWidth={760}
      width="100%"
      margin={[0, 'auto']}
      pad={useScreenVal(
        ['xl', 'md', true, 'md'],
        ['xl', 'xl', true, 'xl'],
        ['xxl', 'xxl', true, 'xxl'],
      )}
      titleBorder
      space
      title={title || 'No title'}
      titleSize="xxxl"
      afterTitle={
        <SurfacePassProps size="lg" cursor="pointer">
          <Row space="sm">
            {!!source && (
              <Button
                tooltip="View Code"
                iconSize={16}
                icon="code"
                onClick={e => {
                  e.stopPropagation()
                  scrollTo('#component-source')
                }}
              />
            )}
            {!!types && (
              <Button
                tooltip="View Prop Types"
                iconSize={16}
                icon="t"
                onClick={e => {
                  e.stopPropagation()
                  scrollTo('#component-props')
                }}
              />
            )}
            {!!source && (
              <Button
                tooltip="Source in Github"
                size="lg"
                tagName="a"
                cursor="pointer"
                {...{ href: 'http://github.com', target: '_blank' }}
                icon={<Icon size={16} svg={GithubIcon} />}
                onClick={e => e.stopPropagation()}
              />
            )}
          </Row>
        </SurfacePassProps>
      }
    >
      {children}

      <MetaSection>
        {!!types && (
          <Card
            background={theme => theme.background.alpha(0.1)}
            collapsable
            collapseOnClick
            title="Props"
            scrollable="y"
            id="component-props"
          >
            <PropsTable props={types.props} />
          </Card>
        )}

        <Space size="xl" />

        {!!source && (
          <Card
            background={theme => theme.background.alpha(0.1)}
            collapsable
            collapseOnClick
            title={`View ${title} Source`}
            maxHeight={650}
            scrollable="y"
            id="component-source"
          >
            <CodeBlock className="language-typescript">{source}</CodeBlock>
          </Card>
        )}
      </MetaSection>
    </Section>
  )
})

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
  // overscan all for searchability
  return (
    <Table
      overscanCount={100}
      sortOrder={{ key: 'name', direction: 'down' }}
      maxHeight={750}
      height={Object.keys(props.props).length * 23}
      rows={propRows}
    />
  )
}
