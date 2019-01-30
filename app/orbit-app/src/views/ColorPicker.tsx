import { Row, View, ViewProps } from '@mcro/ui'
import randomcolor from 'randomcolor'
import React, { useMemo } from 'react'

const margin = [0, 5, 5, 0]

export function ColorPicker({
  count = 10,
  luminosity = 'bright',
  hue,
  ...viewProps
}: {
  count?: number
  seed?: number
  luminosity?: string
  hue?: string
} & ViewProps) {
  const colors = useMemo(
    () =>
      randomcolor({
        count,
        luminosity,
        hue,
      }),
    [count, luminosity, hue],
  )

  return (
    <Row marginBottom={-5}>
      {colors.map(color => (
        <View
          key={color}
          background={color}
          width={20}
          height={20}
          margin={margin}
          borderRadius={2}
          border={[1, [255, 255, 255, 1]]}
          boxShadow={[[0, 2, 2, [0, 0, 0, 0.15]]]}
          {...viewProps}
        />
      ))}
    </Row>
  )
}
