import React from 'react'
import { Surface, SurfaceProps } from '../Surface'
import { Text } from './Text'

export function Banner(props: SurfaceProps) {
  return (
    <Surface background="transparent" alignItems="center" justifyContent="center" padding={[6, 10]}>
      <Text size={0.95} alpha={0.8} fontWeight={400}>
        {props.children}
      </Text>
    </Surface>
  )
}
