import React from 'react'

import { BorderBottom } from '../Border'
import { Section, SectionProps } from '../Section'

export type FieldsetProps = SectionProps & { children: React.ReactNode }

export function Fieldset({ children, ...props }: FieldsetProps) {
  return (
    <Section padding={10} background="transparent" {...props}>
      {children}
      <BorderBottom />
    </Section>
  )
}
