import * as React from 'react'
import { SectionTitle } from './SectionTitle'

type SectionProps = {
  title: string
  type: 'search-list' | 'carousel'
  children: React.ReactNode
}

export const Section = ({ title, children, ...props }: SectionProps) => {
  return (
    <>
      {!!title && <SectionTitle {...props}>{title}</SectionTitle>}
      {children}
    </>
  )
}
