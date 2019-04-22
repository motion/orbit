import GithubIcon from '!raw-loader!../../public/logos/github.svg'
import { Button, Col, Icon, Row, Section, Space, SurfacePassProps, Tag, TitleRow } from '@o/ui'
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
      belowTitle={
        <SurfacePassProps
          chromeless
          cursor="pointer"
          tagName="a"
          textDecoration="none"
          borderWidth={0}
          glint={false}
          sizeRadius={0}
          sizePadding={0}
          marginRight={30}
          alpha={0.75}
          hoverStyle={{
            alpha: 1,
          }}
        >
          <Row>
            {!!source && (
              <Button
                iconSize={16}
                icon="code"
                onClick={e => {
                  e.stopPropagation()
                  scrollTo('#component-source')
                }}
              >
                View Source
              </Button>
            )}
            {!!types && (
              <Button
                iconSize={16}
                icon="t"
                onClick={e => {
                  e.stopPropagation()
                  scrollTo('#component-props')
                }}
              >
                View Props
              </Button>
            )}
          </Row>
        </SurfacePassProps>
      }
      afterTitle={
        <SurfacePassProps size="lg" cursor="pointer">
          <Row space="sm">
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
          <Section size="sm" titleBorder title="Props" id="component-props">
            <PropsTable props={types.props} />
          </Section>
        )}

        <Space size="xl" />

        {!!source && (
          <Section titleBorder size="sm" title={`${title} Source`} id="component-source">
            <CodeBlock className="language-typescript">{source}</CodeBlock>
          </Section>
        )}
      </MetaSection>
    </Section>
  )
})

function PropsTable(props: { props: Object }) {
  const propRows = Object.keys(props.props)
    .reduce((acc, key) => {
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
    .sort((a, b) => (a.required && !b.required ? -1 : 1))
  // overscan all for searchability
  return (
    <>
      {propRows.map(row => (
        <Col key={row.name}>
          <TitleRow pad bordered borderSize={2}>
            <Row space alignItems="center">
              <Tag alt="lightBlue">{row.name}</Tag>
              <Tag alt="lightRed" size={0.9}>
                {row.type}
              </Tag>
            </Row>
          </TitleRow>
          {JSON.stringify(row)}
        </Col>
      ))}
    </>
  )
}
