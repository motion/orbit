import React from 'react'

import { Text, TextProps } from './text/Text'
import { Col, ColProps } from './View/Col'
import { Row, RowProps } from './View/Row'

export type LabeledProps = ColProps
export type LabeledTextProps = TextProps
export type LabeledItemProps = RowProps

export const Labeled = (props: LabeledProps) => {
  return <Col space="xs" alignItems="center" justifyContent="center" {...props} />
}

// @ts-ignore
Labeled.Text = function LabeledText(props: LabeledTextProps) {
  return <Text ellipse size={0.85} alpha={0.8} {...props} />
}

// @ts-ignore
Labeled.Item = function LabeledItem(props: LabeledItemProps) {
  return <Row alignItems="center" position="relative" {...props} />
}
