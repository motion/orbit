import * as React from 'react'
import { HighlightText } from '../HighlightText'
import { view } from '@mcro/black'

const OrbitCardContent = view({
  padding: [6, 0],
  flex: 1,
  overflow: 'hidden',
  whiteSpace: 'pre',
})

const collapseWhitespace = str => str.replace(/\n[\s]*/g, ' ')

export const renderHighlightedText = (text: string) => {
  return (
    <OrbitCardContent>
      <HighlightText ellipse whiteSpace="normal" alpha={0.65} options={{ maxSurroundChars: 100 }}>
        {collapseWhitespace(text)}
      </HighlightText>
    </OrbitCardContent>
  )
}
