import { Row, View } from '@o/gloss'
import React, { isValidElement } from 'react'
import { BorderBottom } from './Border'
import { Space } from './layout/Space'
import { SubTitle } from './text/SubTitle'
import { Title } from './text/Title'

export type TitleRowProps = {
  title: React.ReactNode
  before?: React.ReactNode
  bordered?: boolean
  after?: React.ReactNode
  above?: React.ReactNode
  below?: React.ReactNode
  sizePadding?: number
  backgrounded?: boolean
  subTitle?: React.ReactNode
  margin?: number | number[]
}

export function TitleRow({
  before,
  bordered,
  after,
  margin,
  sizePadding = 1,
  subTitle,
  backgrounded,
  below,
  above,
  title,
}: TitleRowProps) {
  const unpad = 20
  console.log('title', title)
  return (
    <View
      position="relative"
      overflow="hidden"
      paddingTop={unpad + 2.5 * sizePadding}
      paddingBottom={10 * sizePadding + 5}
      paddingLeft={unpad}
      paddingRight={unpad}
      margin={typeof margin !== 'undefined' ? margin : [-unpad, -unpad, 10]}
      background={backgrounded ? theme => theme.backgroundAlt : null}
    >
      {above}
      <Row>
        {before && (
          <>
            {before}
            <Space />
          </>
        )}
        <View flex={1}>
          {isValidElement(title) ? (
            title
          ) : (
            <Title marginTop={0} marginBottom={0}>
              {title}
            </Title>
          )}
          {!!subTitle && (
            <>
              <SubTitle marginBottom={0}>{subTitle}</SubTitle>
            </>
          )}
        </View>
        {after && (
          <>
            <div style={{ flex: 1 }} />
            {after}
          </>
        )}
      </Row>
      <Space />
      {below}
      {bordered && <BorderBottom left={10 * sizePadding} right={10 * sizePadding} opacity={0.5} />}
    </View>
  )
}
