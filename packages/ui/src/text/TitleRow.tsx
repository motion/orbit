import { Row, View } from '@o/gloss'
import React from 'react'
import { BorderBottom } from '../Border'
import { Space } from '../layout/Space'
import { TextProps } from './Text'
import { Title } from './Title'

export type TitleRowProps = TextProps & {
  before?: React.ReactNode
  bordered?: boolean
  after?: React.ReactNode
  below?: React.ReactNode
  sizePadding?: number
  backgrounded?: boolean
}

export function TitleRow({
  before,
  bordered,
  after,
  margin,
  sizePadding = 1,
  backgrounded,
  below,
  ...props
}: TitleRowProps) {
  const unpad = 20
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
      <Row alignItems="center">
        {before && (
          <>
            {before}
            <Space />
          </>
        )}
        <Title margin={0} {...props} />
        {after && (
          <>
            <div style={{ flex: 1 }} />
            {after}
          </>
        )}
      </Row>
      {below}
      {bordered && <BorderBottom left={10 * sizePadding} right={10 * sizePadding} opacity={0.5} />}
    </View>
  )
}
