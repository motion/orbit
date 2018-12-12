import * as React from 'react'
import { HighlightText } from '../HighlightText'
import { view } from '@mcro/black'

const HighlightTextFrame = view({
  padding: [2, 0],
  flex: 1,
  overflow: 'hidden',
  whiteSpace: 'pre',
})

const collapseWhitespace = str => str.replace(/\n[\s]*/g, ' ')

export const renderHighlightedText = (text: string) => {
  return (
    <HighlightTextFrame>
      <HighlightText ellipse whiteSpace="normal" options={{ maxSurroundChars: 100 }}>
        {collapseWhitespace(text)}
      </HighlightText>
    </HighlightTextFrame>
  )
}
