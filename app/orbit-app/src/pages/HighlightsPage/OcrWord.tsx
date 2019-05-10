import { MAC_TOPBAR_HEIGHT } from '@o/constants'
import { gloss } from 'gloss'
import { App } from '@o/stores'
import * as React from 'react'

import { HL_PAD } from './helpers'

const Word = gloss({
  fontFamily: 'helvetica',
  position: 'absolute',
  padding: HL_PAD,
  color: '#000',
  fontWeight: 200,
  highlighted: {
    background: 'yellow',
    borderBottom: [3, '#EDD71E'],
  },
  hovered: {
    background: 'rgba(0,0,0,0.2) !important',
    opacity: 1,
  },
})

const WordInner = gloss({
  opacity: 0.5,
  top: -14,
  left: -4,
  position: 'absolute',
  whiteSpace: 'pre',
})

export default gloss(function OCRWord({ item, store: { hoveredWord } }) {
  const [x, y, width, height, word /* index */, , color] = item
  const key = `wordKey(item)`
  const highlighted = App.state.highlightWords[word]
  return (
    <Word
      hovered={hoveredWord && hoveredWord.key === key}
      highlighted={highlighted}
      style={{
        top: y - HL_PAD - MAC_TOPBAR_HEIGHT,
        left: x - HL_PAD,
        width: width + HL_PAD * 2,
        height: height + HL_PAD * 2,
        background: color,
        fontSize: 10,
        opacity: 1,
      }}
    >
      {!highlighted && <WordInner>{word}</WordInner>}
    </Word>
  )
})
