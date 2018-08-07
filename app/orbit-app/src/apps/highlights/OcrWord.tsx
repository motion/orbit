import * as React from 'react'
import { view } from '@mcro/black'
import { HL_PAD } from './helpers'
import { MAC_TOPBAR_HEIGHT, wordKey } from '@mcro/constants'
import { App } from '@mcro/stores'

const Word = view({
  fontFamily: 'helvetica',
  position: 'absolute',
  padding: HL_PAD,
  color: '#000',
  fontWeight: 200,
  highlighted: {
    borderBottom: [3, '#EDD71E'],
  },
  hovered: {
    background: 'rgba(0,0,0,0.2) !important',
    opacity: 1,
  },
})

const WordInner = view({
  opacity: 0.15,
  top: -14,
  left: -4,
  position: 'absolute',
  whiteSpace: 'pre',
})

export const OCRWord = view(({ item, store: { hoveredWord } }) => {
  const [x, y, width, height, word /* index */, , color] = item
  const key = wordKey(item)
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
        opacity: 1, //highlighted || Desktop.isHoldingOption ? 1 : 0,
      }}
    >
      <WordInner if={!highlighted}>{word}</WordInner>
    </Word>
  )
})
