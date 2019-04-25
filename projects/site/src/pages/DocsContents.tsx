import GithubIcon from '!raw-loader!../../public/logos/github.svg'
import { Button, Col, Icon, Row, Section, Space, SurfacePassProps, Tag, TitleRow } from '@o/ui'
import React, { memo } from 'react'

import { colors } from '../constants'
import { scrollTo } from '../etc/helpers'
import { CodeBlock } from '../views/CodeBlock'
import { IntroText } from '../views/IntroText'
import { MDX } from '../views/MDX'
import { Paragraph } from '../views/Paragraph'
import { MetaSection } from './DocsPage'
import { Example } from './DocsPage/Example'
import { useScreenVal } from './HomePage/SpacedPageContent'

export const DocsContents = memo(
  ({ title, examples, examplesSource, source, children, types }: any) => {
    return (
      <MDX
        components={{
          Example: props => <Example examples={examples} source={examplesSource} {...props} />,
          IntroText: props => (
            <>
              <IntroText {...props} />
              <Space />
            </>
          ),
        }}
      >
        <Space size />
        <Section
          maxWidth={760}
          width="100%"
          margin={[0, 'auto']}
          pad={useScreenVal(
            ['xl', 'md', true, 'md'],
            ['xl', 'md', true, 'md'],
            ['xl', 'lg', true, 'lg'],
          )}
          titleBorder
          space
          title={title || 'No title'}
          titleSize={5}
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
              size="lg"
              alpha={0.75}
              hoverStyle={{
                color: colors.purple,
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
      </MDX>
    )
  },
)

function PropsTable(props: { props: Object }) {
  const propRows = Object.keys(props.props)
    .reduce((acc, key) => {
      const { type, description, defaultValue, required, ...row } = props.props[key]
      acc.push({
        ...row,
        description,
        type: type.name.trim(),
        'Default Value': defaultValue === null ? '' : defaultValue,
        required,
      })
      return acc
    }, [])
    .sort((a, b) => {
      if (a.required && !b.required) {
        return -1
      }
      // if (a.description && !b.description) {
      //   return -1
      // }
      return a.type.localeCompare(b.type)
    })
  // overscan all for searchability
  return (
    <Col space>
      {propRows.map(row => (
        <Col space key={row.name}>
          <TitleRow pad bordered borderSize={2}>
            <Row space alignItems="center">
              <Tag alt="lightBlue">{row.name}</Tag>
              <Tag alt="lightGreen" size={0.75}>
                {row.type}
              </Tag>
              {row.required && (
                <Tag alt="lightRed" size={0.75}>
                  Required
                </Tag>
              )}
            </Row>
          </TitleRow>
          {!!row.description && <Paragraph>{row.description}</Paragraph>}
        </Col>
      ))}
    </Col>
  )
}
