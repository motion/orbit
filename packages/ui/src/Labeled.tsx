import { Base, BaseProps } from 'gloss'
import React, { memo } from 'react'

import { useScale } from './Scale'
import { LINE_HEIGHT } from './SizedSurface'
import { Text, TextProps } from './text/Text'
import { Row, RowProps } from './View/Row'

export type LabeledProps = BaseProps
export type LabeledTextProps = TextProps
export type LabeledItemProps = RowProps

export const Labeled = memo((props: LabeledProps) => {
  const scale = useScale()
  return (
    <Base alignItems="center" justifyContent="center" height={LINE_HEIGHT * 2 * scale} {...props} />
  )
})

// @ts-ignore
Labeled.Text = function LabeledText(props: LabeledTextProps) {
  return <Text ellipse size={0.85} alpha={0.8} {...props} />
}

// @ts-ignore
Labeled.Item = function LabeledItem(props: LabeledItemProps) {
  const scale = useScale()
  return <Row marginBottom={scale * 8} alignItems="center" position="relative" {...props} />
}
