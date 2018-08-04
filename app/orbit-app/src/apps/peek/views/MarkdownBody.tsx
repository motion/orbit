import * as React from 'react'
import { view } from '@mcro/black'

const BodyContents = view({
  whiteSpace: 'pre-line',
  width: '100%',
  flex: 1,
  overflowX: 'hidden',
  overflowY: 'scroll',
  padding: 22,
  fontSize: 16,
  lineHeight: 22,
})

export const MarkdownBody = ({ children }) => (
  <BodyContents
    className="markdown searchable rendered-content"
    dangerouslySetInnerHTML={{
      __html: children,
    }}
  />
)
