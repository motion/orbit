import * as React from 'react'
import { view } from '@mcro/black'
import { HL_PAD, TOP_BAR_PAD, getKey } from './helpers'

const highlightWords = {
  the: true,
  and: true,
  to: true,
  be: true,
  used: true,
  this: true,
}

@view
export default class OCRWord {
  render({ item, store: { hoveredWord } }) {
    const [x, y, width, height, word, color] = item
    const key = getKey(item)
    return (
      <word
        $hovered={hoveredWord && hoveredWord.key === key}
        $highlighted={highlightWords[word]}
        style={{
          top: y - HL_PAD - TOP_BAR_PAD,
          left: x - HL_PAD,
          width: width + HL_PAD * 2,
          height: height + HL_PAD * 2,
          background: color,
          fontSize: 10,
        }}
      >
        <wordInner>{word}</wordInner>
      </word>
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
      background: 'rgba(0,0,0,0.1) !important',
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
