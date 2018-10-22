import * as React from 'react'
import { Surface, Text } from '@mcro/ui'

export const Banner = props => (
  <Surface alignItems="center" justifyContent="center" padding={[6, 10]}>
    <Text size={0.95} alpha={0.9} fontWeight={400}>
      {props.children}
    </Text>
  </Surface>
)
