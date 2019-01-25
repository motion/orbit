import { ViewProps } from '@mcro/gloss'
import { View } from '@mcro/ui'
import * as React from 'react'

export type SectionProps = ViewProps & {
  sizePadding?: number
}

export function Section({ sizePadding = 1, padding, ...props }: SectionProps) {
  return (
    <View
      overflowY="auto"
      maxHeight="100%"
      padding={padding || [sizePadding * 20, sizePadding * 30]}
      {...props}
    />
  )
}
