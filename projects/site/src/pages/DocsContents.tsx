import GithubIcon from '!raw-loader!../../public/logos/github.svg'
import { Button, Card, Icon, Row, Section, Space, SurfacePassProps } from '@o/ui'
import React, { memo } from 'react'

import { CodeBlock } from '../views/CodeBlock'
import { MetaSection, PropsTable } from './DocsPage'
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
                iconSize={20}
                icon="code"
                onClick={e => e.stopPropagation()}
              />
            )}
            {!!types && (
              <Button
                tooltip="View Prop Types"
                iconSize={20}
                icon="t"
                onClick={e => e.stopPropagation()}
              />
            )}
            {!!source && (
              <Button
                tooltip="Source in Github"
                size="lg"
                tagName="a"
                cursor="pointer"
                {...{ href: 'http://github.com', target: '_blank' }}
                icon={<Icon size={20} svg={GithubIcon} />}
                onClick={e => e.stopPropagation()}
              />
            )}
          </Row>
        </SurfacePassProps>
      }
    >
      <MetaSection>
        {!!source && (
          <Card
            background={theme => theme.background.alpha(0.1)}
            collapsable
            defaultCollapsed
            collapseOnClick
            title={`View ${title} Source`}
            maxHeight={450}
            scrollable="y"
          >
            <CodeBlock className="language-typescript">{source}</CodeBlock>
          </Card>
        )}

        <Space size="sm" />

        {!!types && (
          <Card
            background={theme => theme.background.alpha(0.1)}
            collapsable
            defaultCollapsed
            collapseOnClick
            title="Props"
            scrollable="y"
          >
            <PropsTable props={types.props} />
          </Card>
        )}
      </MetaSection>

      {children}
    </Section>
  )
})
