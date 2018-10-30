import * as React from 'react'
import { SectionTitle } from './SectionTitle'

type SectionProps = {
  title: string
  type: 'search-list' | 'carousel'
  children: React.ReactNode
  padTitle?: boolean
}

export const Section = ({ title, children, padTitle, ...props }: SectionProps) => {
  return (
    <>
      {!!title && (
        <SectionTitle padding={padTitle ? [0, 8] : 0} {...props}>
          {title}
        </SectionTitle>
      )}
      {children}
    </>
  )
}
