import GithubIcon from '!raw-loader!../public/logos/github.svg'
import { themes } from '@o/kit'
import { Button, gloss, Icon, Row, Section, Space, SurfacePassProps, Tag, Title } from '@o/ui'
import { ThemeProvide } from 'gloss'
import React, { memo } from 'react'

import { colors } from '../colors'
import { scrollTo } from '../etc/helpers'
import { Navigation } from '../Navigation'
import { linkProps } from '../useLink'
import { CodeBlock } from '../views/CodeBlock'
import { FadeChild } from '../views/FadeInView'
import { MDX } from '../views/MDX'
import { docsItems } from './docsItems'
import { Example } from './DocsPage/Example'
import { useScreenVal } from './HomePage/SpacedPageContent'
import { PropsTable } from './PropsTable'

export const DocsContents = memo(
  ({ id, title, examples, examplesSource, source, children, types, beta }: any) => {
    const thisIndex = docsItems.all.findIndex(x => x['id'] === id)
    const nextItem = docsItems.all.find((x, i) => i > thisIndex && !!x['title'])
    const prevItem = docsItems.all[thisIndex - 1]

    const nextPrevious = (
      <>
        <SurfacePassProps
          alt="bordered"
          size={1.5}
          sizeFont={0.75}
          flex={1}
          ellipse
          cursor="pointer"
          elementProps={{ tagName: 'a' }}
          textDecoration="none"
        >
          <Row marginTop={80} width="100%" space>
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

    const padding = useScreenVal(
      ['xxl', 'md', true, 'md'],
      ['xxl', 'md', true, 'md'],
      ['xxxl', 'xl', true, 'xl'],
    )

    return (
      <ThemeProvide themes={themes}>
        <MDX
          components={{
            Example: props => (
              <Example parentId={id} examples={examples} source={examplesSource} {...props} />
            ),
          }}
        >
          <Section
            maxWidth={760}
            width="100%"
            margin={[0, 'auto']}
            padding={padding}
            titlePadding={padding}
            titleBorder
            space
            title={
              <FadeChild>
                <Title size={(title || '').length > 22 ? 2 : 2.5}>{title || 'No title'}</Title>
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
                  alpha={0.65}
                  hoverStyle={{
                    color: colors.purple,
                  }}
                >
                  <Row>
                    {!!types && (
                      <Button
                        iconSize={16}
                        icon="t"
                        tooltip="Component Props"
                        onClick={e => {
                          e.stopPropagation()
                          scrollTo('#component-props')
                        }}
                      >
                        Props
                      </Button>
                    )}
                    {!!source && (
                      <Button
                        iconSize={16}
                        icon="code"
                        tooltip="View Component Source"
                        onClick={e => {
                          e.stopPropagation()
                          scrollTo('#component-source')
                        }}
                      >
                        Component
                      </Button>
                    )}
                    {!!source && (
                      <Button
                        iconSize={16}
                        icon="code"
                        tooltip="View Source for this Page"
                        onClick={e => {
                          e.stopPropagation()
                          scrollTo('#component-source')
                        }}
                      >
                        Page
                      </Button>
                    )}
                  </Row>
                </SurfacePassProps>
              </FadeChild>
            }
            afterTitle={
              <>
                {beta && <Tag alt="lightRed">Beta</Tag>}
                {!!source && (
                  <Button
                    tooltip="Source in Github"
                    size="lg"
                    {...linkProps(`https://github.com/motion/orbit`)}
                    icon={<Icon size={16} svg={GithubIcon} />}
                    onClick={e => e.stopPropagation()}
                  />
                )}
              </>
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
                      <CodeBlock>{source}</CodeBlock>
                    </Section>
                  )}
                </MetaSection>

                <Space size="xxl" />

                {nextPrevious}
              </>
            )}
          </Section>
        </MDX>
      </ThemeProvide>
    )
  },
)

const MetaSection = gloss({
  margin: 0,
})
