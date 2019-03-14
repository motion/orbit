import React from 'react'
import { BorderBottom } from '../Border'
import { Section } from '../Section'

export function Fieldset(props: { children: React.ReactNode }) {
  return (
    <Section>
      {props.children}
      <BorderBottom light />
    </Section>
  )
}
