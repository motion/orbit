import { gloss, ViewProps } from '@mcro/gloss'
import { TextProps, Title, View } from '@mcro/ui'
import * as React from 'react'

export type SectionProps = ViewProps & {
  sizePadding?: number
}

export const Section = gloss<SectionProps>(View, {
  overflowY: 'auto',
  maxHeight: '100%',
  position: 'relative',
}).theme(({ sizePadding = 1, padding }) => ({
  padding: padding || [sizePadding * 15, sizePadding * 15],
}))

export function SectionTitle(props: TextProps) {
  return (
    <Section paddingBottom={0}>
      <Title {...props} />
    </Section>
  )
}
