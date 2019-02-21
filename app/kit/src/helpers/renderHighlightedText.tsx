import { gloss } from '@mcro/gloss'
import { HighlightText } from '@mcro/ui'
import React from 'react'

const HighlightTextFrame = gloss({
  flex: 1,
  overflow: 'hidden',
  whiteSpace: 'pre',
})

const collapseWhitespace = str => str.replace(/\n[\s]*/g, ' ')

export function renderHighlightedText(text: string) {
  return (
    <HighlightTextFrame>
      <HighlightText whiteSpace="normal" options={{ maxSurroundChars: 100 }}>
        {collapseWhitespace(text)}
      </HighlightText>
    </HighlightTextFrame>
  )
}

export function renderHighlightedTextSingle(text: string) {
  return (
    <HighlightTextFrame>
      <HighlightText ellipse whiteSpace="normal" options={{ maxSurroundChars: 100 }}>
        {collapseWhitespace(text)}
      </HighlightText>
    </HighlightTextFrame>
  )
}
