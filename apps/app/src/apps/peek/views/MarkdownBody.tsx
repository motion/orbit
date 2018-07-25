import * as React from 'react'
import { view } from '@mcro/black'

const BodyContents = view({
  whiteSpace: 'pre-line',
  width: '100%',
  flex: 1,
  overflowX: 'hidden',
  overflowY: 'scroll',
  padding: 20,
  fontSize: 18,
  lineHeight: 26,
})

export const MarkdownBody = ({ children }) => (
  <BodyContents
    className="markdown searchable"
    dangerouslySetInnerHTML={{
      __html: children,
    }}
  />
)
