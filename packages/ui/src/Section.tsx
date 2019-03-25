import { gloss, Row, View, ViewProps } from '@o/gloss'
import { selectDefined } from '@o/utils'
import React from 'react'
import { Space } from './layout/Space'
import { SubTitle } from './text/SubTitle'
import { Title } from './text/Title'

export type SectionProps = ViewProps & {
  sizePadding?: number
  above?: React.ReactNode
  title?: React.ReactNode
  subTitle?: React.ReactNode
  controls?: React.ReactNode
  scrollable?: boolean
}

export function Section({
  above,
  title,
  subTitle,
  scrollable,
  children,
  controls,
  sizePadding,
  ...props
}: SectionProps) {
  return (
    <SectionChrome sizePadding={sizePadding}>
      {!!title && (
        <>
          <Row padding={[10, 0]}>
            <View flex={1}>
              <Title marginTop={0} marginBottom={0}>
                {title}
              </Title>
              {!!subTitle && (
                <>
                  <Space small />
                  <SubTitle marginBottom={0}>{subTitle}</SubTitle>
                </>
              )}
            </View>

            {controls || null}
          </Row>
          <Space />
        </>
      )}
      <View overflowY={scrollable ? 'auto' : 'inherit'} {...props}>
        {children}
      </View>
    </SectionChrome>
  )
}

const SectionChrome = gloss<SectionProps>(View, {
  position: 'relative',
}).theme(({ sizePadding = 1, padding, ...p }) => ({
  paddingTop: selectDefined(p.paddingTop, padding, sizePadding * 15),
  paddingLeft: selectDefined(p.paddingLeft, padding, sizePadding * 15),
  paddingRight: selectDefined(p.paddingRight, padding, sizePadding * 15),
  paddingBottom: selectDefined(p.paddingBottom, padding, sizePadding * 15),
}))
