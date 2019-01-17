import { CSSPropertySet } from '@mcro/gloss'
import { View } from '@mcro/ui'
import * as React from 'react'
import { SectionTitle } from './SectionTitle'

type SectionProps = CSSPropertySet & {
  title: string
  children: React.ReactNode
  padTitle?: boolean
  titleProps?: Object
}

export const Section = ({ title, children, padTitle, titleProps, ...props }: SectionProps) => {
  return (
    <>
      {!!title && (
        <SectionTitle padding={padTitle ? [0, 8] : 0} {...titleProps}>
          {title}
        </SectionTitle>
      )}
      <View {...props}>{children}</View>
    </>
  )
}
