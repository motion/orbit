import * as React from 'react'
import { view } from '@mcro/black'
import { View } from '@mcro/ui'

const gridGap = 8

const GridFrame = view(View, {
  display: 'grid',
  gridGap,
  // height of items
  margin: [0, -4],
})

export const Grid = ({ columnWidth = 200, height = 70, ...props }) => {
  return (
    <GridFrame
      gridAutoRows={height}
      gridTemplateColumns={`repeat(auto-fill, minmax(${columnWidth}px, 1fr))`}
      {...props}
    />
  )
}
