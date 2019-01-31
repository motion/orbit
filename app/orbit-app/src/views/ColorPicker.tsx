import { Row, View, ViewProps } from '@mcro/ui'
import randomcolor from 'randomcolor'
import React, { useMemo } from 'react'

const margin = [0, 5, 5, 0]

export function ColorPicker({
  count = 10,
  luminosity = 'bright',
  hue,
  onChangeColor,
  activeColor,
  ...viewProps
}: {
  activeColor?: string
  count?: number
  seed?: number
  luminosity?: string
  hue?: string
  onChangeColor?: (color: string) => any
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
    <Row marginBottom={-5} flexWrap="wrap">
      {colors.map(color => (
        <View
          key={color}
          background={color}
          width={30}
          height={30}
          margin={margin}
          borderRadius={2}
          border={[1, activeColor === color ? 'black' : [255, 255, 255, 1]]}
          boxShadow={[[0, 2, 2, [0, 0, 0, 0.15]]]}
          onClick={() => {
            onChangeColor(color)
          }}
          {...viewProps}
        />
      ))}
    </Row>
  )
}
