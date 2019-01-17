import { Surface, Text } from '@mcro/ui'
import * as React from 'react'

export const Banner = props => (
  <Surface background="transparent" alignItems="center" justifyContent="center" padding={[6, 10]}>
    <Text size={0.95} alpha={0.8} fontWeight={400}>
      {props.children}
    </Text>
  </Surface>
)
