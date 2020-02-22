import { HighlightText } from '@o/ui'
import { gloss } from 'gloss'
import React from 'react'

const HighlightTextFrame = gloss({
  flex: 1,
  overflow: 'hidden',
  whiteSpace: 'pre',
})

const collapseWhitespace = (str: string) => str.replace(/\n[\s]*/g, ' ')

export function renderHighlightedText(text: string) {
  return (
    <HighlightTextFrame>
      <HighlightText whiteSpace="normal" maxSurroundChars={100}>
        {collapseWhitespace(text)}
      </HighlightText>
    </HighlightTextFrame>
  )
}

export function renderHighlightedTextSingle(text: string) {
  return (
    <HighlightTextFrame>
      <HighlightText ellipse whiteSpace="normal" maxSurroundChars={100}>
        {collapseWhitespace(text)}
      </HighlightText>
    </HighlightTextFrame>
  )
}
