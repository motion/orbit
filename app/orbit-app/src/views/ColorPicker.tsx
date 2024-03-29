import { IconShape, Stack, toColor, View, ViewProps } from '@o/ui'
import { gloss } from 'gloss'
import { uniqBy } from 'lodash'
import memoize from 'memoize-weak'
import React, { memo } from 'react'

const niceColorsSingle = [
  'rgb(127, 219, 255)',
  'rgb(0, 116, 217)',
  'rgb(1, 255, 112)',
  'rgb(57, 204, 204)',
  'rgb(61, 153, 112)',
  'rgb(46, 204, 64)',
  'rgb(255, 65, 54)',
  'rgb(255, 133, 27)',
  'rgb(177, 13, 201)',
  'rgb(255, 220, 0)',
  'rgb(240, 18, 190)',
  'rgb(133, 20, 75)',
  '#386798',
  '#297297',
  '#EADEAD',
]

const niceColors = uniqBy(
  [
    ...niceColorsSingle.map(x => [x, toColor(x).darken(0.15)]),
    ...niceColorsSingle.map((x, i) => [niceColorsSingle[i + 2] || niceColorsSingle[0], x]),
    ...niceColorsSingle.map((x, i) => [niceColorsSingle[i - 2] || niceColorsSingle[0], x]),
    ...niceColorsSingle.map((x, i) => [x, niceColorsSingle[i + 1] || niceColorsSingle[0]]),
    ...niceColorsSingle.map((x, i) => [x, niceColorsSingle[i - 1] || niceColorsSingle[0]]),
    ...niceColorsSingle.map((x, i) => [x, niceColorsSingle[i - 2] || niceColorsSingle[0]]),
    ...niceColorsSingle.map((x, i) => [x, niceColorsSingle[i + 2] || niceColorsSingle[0]]),
  ],
  x => JSON.stringify(x),
)

type ColorPickerProps = ViewProps & {
  activeColor?: string
  count?: number
  seed?: number
  luminosity?: string
  hue?: string
  size?: number
  onChangeColor?: (colors: [string, string]) => any
}

export const ColorPicker = memo(
  ({
    count = Infinity,
    luminosity = 'dark',
    hue,
    onChangeColor,
    activeColor,
    size = 32,
    className,
    ...viewProps
  }: ColorPickerProps) => {
    const combos = niceColors.slice(0, count)
    const setupOnClick = memoize(colors => () => {
      if (onChangeColor) {
        onChangeColor([`${colors[0]}`, `${colors[1]}`])
      }
    })

    return (
      <Stack direction="horizontal" padding="sm" space scrollable="x" hideScrollbars flex={1}>
        {combos.map((colors, i) => (
          <IconShape
            key={`${JSON.stringify(colors)}${i}`}
            gradient={colors}
            size={size}
            active={activeColor === colors[0]}
            onClick={setupOnClick(colors)}
            name="dot"
            {...viewProps}
          />
        ))}
      </Stack>
    )
  },
)

const SVG = gloss(View, {
  tagName: 'svg',
})
