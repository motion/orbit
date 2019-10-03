import GithubIcon from '!raw-loader!../public/logos/github.svg'
import { Button, gloss, Icon, scrollTo, Section, Space, Stack, SurfacePassProps, Tag, View } from '@o/ui'
import React, { memo } from 'react'

import { colors } from '../colors'
import { Navigation } from '../Navigation'
import { linkProps } from '../useLink'
import { CodeBlock } from '../views/CodeBlock'
import { MDX } from '../views/MDX'
import { TitleText } from '../views/TitleText'
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
          coat="bordered"
          size={1.5}
          sizeFont={0.75}
          flex={1}
          ellipse
          cursor="pointer"
          elementProps={{ tagName: 'a' }}
          textDecoration="none"
        >
          <Stack direction="horizontal" marginTop={80} width="100%" space>
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
          </Stack>
        </SurfacePassProps>
      </>
    )

    const padding = useScreenVal(
      ['xxl', 'md', true, 'md'],
      ['xxl', 'md', true, 'md'],
      ['xxxl', 'xl', true, 'xl'],
    )

    return (
      <MDX
        components={{
          Example: props => (
            <Example parentId={id} examples={examples} source={examplesSource} {...props} />
          ),
        }}
      >
        <Section
          width="100%"
          margin={[0, 'auto']}
          padding={padding}
          titlePadding={padding}
          titleBorder
          space
          title={
            <TitleText size={(title || '').length > 16 ? 'lg' : 'xl'}>
              {title || 'No title'}
            </TitleText>
          }
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
              size="md"
              alpha={0.65}
              hoverStyle={{
                color: colors.purple,
              }}
            >
              <Stack direction="horizontal" margin={[0, 0, -8]}>
                {!!types && (
                  <Button
                    iconSize={16}
                    icon="properties"
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
                    Component Source
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
                    Page Source
                  </Button>
                )}
              </Stack>
            </SurfacePassProps>
          }
          afterTitle={
            <>
              {beta && <Tag coat="lightRed">Beta</Tag>}
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
          <View className="orbit-example-section">{children}</View>

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
    )
  },
)

// @ts-ignore
DocsContents.theme = 'docsPageTheme'

const MetaSection = gloss({
  margin: 0,
})
