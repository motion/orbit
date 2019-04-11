import { Section, SectionProps, Space } from '@o/ui'
import React from 'react'

export function Example({ children, ...props }: SectionProps) {
  return (
    <>
      <Section space {...props}>
        {children}
      </Section>
      <Space size="xxl" />
    </>
  )
}
