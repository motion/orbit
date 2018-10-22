import * as React from 'react'
import { HighlightText } from '../../views/HighlightText'
import { view } from '@mcro/black'
import { Text } from '@mcro/ui'

const SearchResultText = props => <Text wordBreak="break-all" fontWeight={400} {...props} />
const collapseWhitespace = str => (typeof str === 'string' ? str.replace(/\n[\s]*/g, ' ') : str)

const OrbitCardContent = view({
  padding: [6, 0],
  flex: 1,
  overflow: 'hidden',
  whiteSpace: 'pre',
})

export const renderListItemChildren = ({ content = null }, bit) => {
  return bit.integration === 'slack' ? (
    <SearchResultText>{content}</SearchResultText>
  ) : (
    <OrbitCardContent>
      <HighlightText whiteSpace="normal" alpha={0.65} options={{ maxSurroundChars: 100 }}>
        {collapseWhitespace(content)}
      </HighlightText>
    </OrbitCardContent>
  )
}
