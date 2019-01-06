import * as React from 'react'
import { View } from '@mcro/ui'
import { gloss } from '@mcro/gloss'

const GridFrame = gloss(View, {
  display: 'grid',
})

export const Grid = ({ columnWidth = 200, height = 70, gridGap = 8, ...props }) => {
  return (
    <GridFrame
      gridAutoRows={height}
      gridTemplateColumns={`repeat(auto-fill, minmax(${columnWidth}px, 1fr))`}
      gridGap={gridGap}
      {...props}
    />
  )
}
