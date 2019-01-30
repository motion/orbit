import { View, ViewProps } from '@mcro/ui'
import randomcolor from 'randomcolor'
import React from 'react'

const margin = [0, 10, 10, 0]

export function ColorPicker({
  count = 10,
  seed = 0,
  luminosity = 'bright',
  hue,
  ...viewProps
}: {
  count?: number
  seed?: number
  luminosity?: string
  hue?: string
} & ViewProps) {
  const colors = randomcolor({
    count,
    seed,
    luminosity,
    hue,
  })

  return colors.map(color => (
    <View key={color} background={color} width={20} height={20} margin={margin} {...viewProps} />
  ))
}
