import * as React from 'react'
import { view } from '@mcro/black'
import { HL_PAD, TOP_BAR_PAD } from './helpers'
import { App } from '@mcro/stores'
import * as Helpers from '@mcro/constants'

@view
export class OCRWord {
  render({ item, store: { hoveredWord } }) {
    const [x, y, width, height, word, index, color] = item
    const key = Helpers.wordKey(item)
    const highlighted = App.state.highlightWords[word]
    return (
      <div
        $word
        $hovered={hoveredWord && hoveredWord.key === key}
        $highlighted={highlighted}
        style={{
          top: y - HL_PAD - TOP_BAR_PAD,
          left: x - HL_PAD,
          width: width + HL_PAD * 2,
          height: height + HL_PAD * 2,
          background: color,
          fontSize: 10,
          opacity: 1, //highlighted || Desktop.isHoldingOption ? 1 : 0,
        }}
      >
        <div $wordInner if={!highlighted}>
          {word}
        </div>
      </div>
    )
  }
  static style = {
    word: {
      fontFamily: 'helvetica',
      position: 'absolute',
      padding: HL_PAD,
      color: '#000',
      fontWeight: 200,
    },
    highlighted: {
      borderBottom: [3, '#EDD71E'],
    },
    hovered: {
      background: 'rgba(0,0,0,0.2) !important',
      opacity: 1,
    },
    wordInner: {
      opacity: 0.15,
      top: -14,
      left: -4,
      position: 'absolute',
      wordWrap: 'no-wrap',
      whiteSpace: 'pre',
    },
  }
}
