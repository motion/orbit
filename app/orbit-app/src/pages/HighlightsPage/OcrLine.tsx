import * as React from 'react'
import { LINE_Y_ADJ } from './helpers'
import { MAC_TOPBAR_HEIGHT } from '@mcro/constants'
import { gloss } from '@mcro/gloss'

const OcrLine = gloss({
  borderBottom: [2, '#EDD71E'],
  position: 'absolute',
  opacity: 0.05,
  hovered: {
    borderBottom: [3, '#EDD71E'],
  },
})

export default gloss(function OCRLine({ item, store: { hoveredLine } }) {
  const [x, y, width, height] = item
  const key = `${Math.random()}` // TODO
  // const key = wordKey(item)
  return (
    <OcrLine
      hovered={hoveredLine && hoveredLine.string === key}
      style={{
        top: y - MAC_TOPBAR_HEIGHT + LINE_Y_ADJ,
        left: x,
        width: width,
        height: height, // add some padding
      }}
    />
  )
})
