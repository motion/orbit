import * as React from 'react'
import { view } from '@mcro/black'
import * as Helpers from '@mcro/constants'
import { LINE_Y_ADJ, TOP_BAR_PAD } from './helpers'

const OcrLine = view({
  borderBottom: [2, '#EDD71E'],
  position: 'absolute',
  opacity: 0.05,
  hovered: {
    borderBottom: [3, '#EDD71E'],
  },
})

@view
export class OCRLine {
  render() {
    const {
      item,
      store: { hoveredLine },
    } = this.props
    const [x, y, width, height] = item
    const key = Helpers.wordKey(item)
    return (
      <OcrLine
        hovered={hoveredLine && hoveredLine.string === key}
        style={{
          top: y - TOP_BAR_PAD + LINE_Y_ADJ,
          left: x,
          width: width,
          height: height, // add some padding
        }}
      />
    )
  }
}
