import { gloss } from '@mcro/gloss'
import * as React from 'react'
import { HighlightText } from '../HighlightText'

const HighlightTextFrame = gloss({
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
