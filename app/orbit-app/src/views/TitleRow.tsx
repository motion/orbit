import { Row, TextProps } from '@mcro/ui'
import React from 'react'
import { HorizontalSpace, Title } from '.'
import { BorderBottom } from './Border'

type TitleRowProps = TextProps & {
  before?: React.ReactNode
  bordered?: boolean
  after?: React.ReactNode
}

export function TitleRow({ before, bordered, after, margin, ...props }: TitleRowProps) {
  return (
    <Row
      position="relative"
      alignItems="center"
      overflow="hidden"
      paddingBottom={10}
      margin={margin || [0, 0, 20]}
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
      {bordered && <BorderBottom />}
    </Row>
  )
}
