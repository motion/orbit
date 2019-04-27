import GithubIcon from '!raw-loader!../../public/logos/github.svg'
import { Button, Col, gloss, Icon, Row, Section, Space, SurfacePassProps, Tag, Title, TitleRow } from '@o/ui'
import React, { memo } from 'react'

import { colors } from '../constants'
import { scrollTo } from '../etc/helpers'
import { Navigation } from '../Navigation'
import { CodeBlock } from '../views/CodeBlock'
import { FadeChild } from '../views/FadeIn'
import { MDX } from '../views/MDX'
import { Paragraph } from '../views/Paragraph'
import { docsItems } from './docsItems'
import { Example } from './DocsPage/Example'
import { useScreenVal } from './HomePage/SpacedPageContent'

export const DocsContents = memo(
  ({ id, title, examples, examplesSource, source, children, types }: any) => {
    const thisIndex = docsItems.all.findIndex(x => x['id'] === id)
    const nextItem = docsItems.all[thisIndex + 1]
    const prevItem = docsItems.all[thisIndex - 1]

    const nextPrevious = (
      <>
        <Title size="md">Continue reading docs</Title>
        <Space />
        <SurfacePassProps
          alt="bordered"
          size={2}
          flex={1}
          ellipse
          cursor="pointer"
          elementProps={{ tagName: 'a' }}
          textDecoration="none"
        >
          <Row width="100%" space>
            {!!prevItem && (
              <Button
                onClick={e => {
                  e.preventDefault()
                  Navigation.navigate(`/docs/${prevItem['id']}`, { replace: true })
                }}
              >
                Previous: {prevItem['title']}
              </Button>
            )}
            {!!nextItem && (
              <Button
                onClick={e => {
                  e.preventDefault()
                  Navigation.navigate(`/docs/${nextItem['id']}`, { replace: true })
                }}
              >
                Next: {nextItem['title']}
              </Button>
            )}
          </Row>
        </SurfacePassProps>
      </>
    )

    return (
      <MDX
        components={{
          Example: props => <Example examples={examples} source={examplesSource} {...props} />,
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
          title={
            <FadeChild>
              <Title size={5}>{title || 'No title'}</Title>
            </FadeChild>
          }
          belowTitle={
            <FadeChild>
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
                alpha={0.5}
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
            </FadeChild>
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
          <FadeChild delay={100}>{children}</FadeChild>

          <Space size="xxl" />

          {nextPrevious}

          {!!(types || source) && (
            <>
              <Space size="xxl" />

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

              <Space size="xxl" />

              {nextPrevious}
            </>
          )}
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

const MetaSection = gloss({
  margin: 0,
})
