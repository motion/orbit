import React from 'react'

import { Section, SectionProps } from './Section'
import { SubTitle } from './text/SubTitle'

export type SubSectionProps = SectionProps

export function SubSection({ title, ...sectionProps }: SubSectionProps) {
  return <Section pad title={<SubTitle>{title}</SubTitle>} {...sectionProps} />
}
