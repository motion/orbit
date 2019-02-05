import { ViewProps } from '@mcro/gloss'
import { TextProps, View } from '@mcro/ui'
import * as React from 'react'
import { Title } from '.'

export type SectionProps = ViewProps & {
  sizePadding?: number
}

export function Section({ sizePadding = 1, padding, ...props }: SectionProps) {
  return (
    <View
      overflowY="auto"
      maxHeight="100%"
      position="relative"
      padding={padding || [sizePadding * 20, sizePadding * 15]}
      {...props}
    />
  )
}

export function SectionTitle(props: TextProps) {
  return (
    <Section paddingBottom={0}>
      <Title {...props} />
    </Section>
  )
}
