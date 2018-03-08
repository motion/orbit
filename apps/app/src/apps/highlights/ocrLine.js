import * as React from 'react'
import { view } from '@mcro/black'
import { Helpers } from '@mcro/all'
import { LINE_Y_ADJ, TOP_BAR_PAD } from './helpers'

@view
export default class OCRLine {
  render({ item, store: { hoveredLine } }) {
    const [x, y, width, height] = item
    const key = Helpers.wordKey(item)
    return (
      <ocrLine
        $hoveredLine={hoveredLine && hoveredLine.string === key}
        style={{
          top: y - TOP_BAR_PAD + LINE_Y_ADJ,
          left: x,
          width: width,
          height: height, // add some padding
        }}
      />
    )
  }
  static style = {
    ocrLine: {
      borderBottom: [2, '#EDD71E'],
      position: 'absolute',
      opacity: 0.05,
    },
    hoveredLine: {
      borderBottom: [3, '#EDD71E'],
    },
  }
}
