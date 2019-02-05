import { View, ViewProps } from '@mcro/ui'
import React from 'react'

export default function VerticalSplitPane(props: ViewProps) {
  return <View width="50%" position="relative" overflow="hidden" {...props} />
}
