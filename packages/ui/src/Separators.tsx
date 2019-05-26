import { Col, ColProps, Row, RowProps, useTheme } from 'gloss'
import React from 'react'

import { BorderRight, BorderTop } from './Border'

export const SeparatorVertical = (props: ColProps) => {
  const theme = useTheme()
  return (
    <Col width={1} height="100%" position="relative" {...props}>
      <BorderRight borderColor={theme.backgroundStrongest} />
    </Col>
  )
}

export const SeparatorHorizontal = (props: RowProps) => {
  const theme = useTheme()
  return (
    <Row height={1} width="100%" position="relative" {...props}>
      <BorderTop borderColor={theme.backgroundStrongest} />
    </Row>
  )
}
