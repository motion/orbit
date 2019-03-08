import { Row } from '@o/gloss'
import React from 'react'
import { BorderBottom } from '../Border'
import { HorizontalSpace } from '../layout/HorizontalSpace'
import { TextProps } from './Text'
import { Title } from './Title'

export type TitleRowProps = TextProps & {
  before?: React.ReactNode
  bordered?: boolean
  after?: React.ReactNode
  sizePadding?: number
}

export function TitleRow({
  before,
  bordered,
  after,
  margin,
  sizePadding = 1,
  ...props
}: TitleRowProps) {
  return (
    <Row
      position="relative"
      alignItems="center"
      overflow="hidden"
      padding={[2.5 * sizePadding, 0, 10 * sizePadding + 5]}
      margin={typeof margin !== 'undefined' ? margin : [0, 0, 10]}
    >
      {before && (
        <>
          {before}
          <HorizontalSpace />
        </>
      )}
      <Title margin={0} {...props} />
      {after && (
        <>
          <div style={{ flex: 1 }} />
          {after}
        </>
      )}
      {bordered && <BorderBottom left={10 * sizePadding} right={10 * sizePadding} opacity={0.5} />}
    </Row>
  )
}
