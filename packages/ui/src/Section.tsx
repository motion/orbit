import { gloss, View, ViewProps } from '@o/gloss'
import { selectDefined } from '@o/utils'
import * as React from 'react'
import { TextProps } from './text/Text'
import { Title } from './text/Title'

export type SectionProps = ViewProps & {
  sizePadding?: number
}

export const Section = gloss<SectionProps>(View, {
  position: 'relative',
}).theme(({ sizePadding = 1, padding, ...p }) => ({
  paddingTop: selectDefined(p.paddingTop, padding, sizePadding * 15),
  paddingLeft: selectDefined(p.paddingLeft, padding, sizePadding * 15),
  paddingRight: selectDefined(p.paddingRight, padding, sizePadding * 15),
  paddingBottom: selectDefined(p.paddingBottom, padding, sizePadding * 15),
}))

export function SectionTitle(props: TextProps) {
  return (
    <Section paddingBottom={0}>
      <Title {...props} />
    </Section>
  )
}
