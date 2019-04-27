import { Section, Text } from '@o/ui'
import React from 'react'

export let Simple = (
  <Section pad title="Hello World" subTitle="Section">
    <Text>Some text goes here</Text>
  </Section>
)

export let Full = (
  <Section bordered collapsable defaultCollapsed pad title="Hello World" subTitle="Section">
    <Text>Some text goes here</Text>
  </Section>
)
