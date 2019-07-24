import React from 'react'

import { Section, SectionProps } from './Section'
import { Title } from './text/Title'

export type SubSectionProps = SectionProps

export function SubSection({ title, ...sectionProps }: SubSectionProps) {
  return (
    <Section
      padding
      title={
        <Title size="xxs" fontWeight={500}>
          {title}
        </Title>
      }
      {...sectionProps}
    />
  )
}
