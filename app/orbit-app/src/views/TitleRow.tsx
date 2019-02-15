import { Row, TextProps } from '@mcro/ui'
import React from 'react'
import { HorizontalSpace, Title } from '.'
import { BorderBottom } from './Border'

type TitleRowProps = TextProps & {
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
      padding={[10 * sizePadding, 10 * sizePadding, 5 * sizePadding]}
      margin={typeof margin !== 'undefined' ? margin : [0, 0, 20]}
    >
      {before && (
        <>
          {before}
          <HorizontalSpace />
        </>
      )}
      <Title marginBottom={4} {...props} />
      {after && (
        <>
          <div style={{ flex: 1 }} />
          {after}
        </>
      )}
      {bordered && <BorderBottom left={10 * sizePadding} right={10 * sizePadding} />}
    </Row>
  )
}
