import * as React from 'react'
import { view } from '@mcro/black'
import { View } from '@mcro/ui'

const height = 70
const gridGap = 8

const GridFrame = view(View, {
  display: 'grid',
  gridGap,
  // height of items
  gridAutoRows: height,
  margin: [0, -4],
})

export const Grid = ({ columnWidth = 200, ...props }) => {
  return (
    <GridFrame
      gridTemplateColumns={`repeat(auto-fill, minmax(${columnWidth}px, 1fr))`}
      {...props}
    />
  )
}
