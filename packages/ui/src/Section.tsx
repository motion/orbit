import { gloss, View, ViewProps } from '@o/gloss'
import * as React from 'react'
import { TextProps } from './text/Text'
import { Title } from './text/Title'

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
