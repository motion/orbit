import React from 'react'

import { Text, TextProps } from './text/Text'
import { Stack, StackProps } from './View/Stack'

export type LabeledProps = StackProps
export type LabeledTextProps = TextProps
export type LabeledItemProps = StackProps

export const Labeled = (props: LabeledProps) => {
  return <Stack space="sm" alignItems="center" justifyContent="center" {...props} />
}

// @ts-ignore
Labeled.Text = function LabeledText(props: LabeledTextProps) {
  return <Text ellipse size={0.85} alpha={0.8} {...props} />
}

// @ts-ignore
Labeled.Item = function LabeledItem(props: LabeledItemProps) {
  return <Stack direction="horizontal" alignItems="center" position="relative" {...props} />
}
