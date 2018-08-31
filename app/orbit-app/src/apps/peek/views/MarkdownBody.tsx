import * as React from 'react'
import { view } from '@mcro/black'

const BodyContents = view({
  width: '100%',
  flex: 1,
  overflowX: 'hidden',
  overflowY: 'scroll',
  padding: 22,
  fontSize: 16,
  lineHeight: 24,
  display: 'block',
})

export const MarkdownBody = ({ children }) => (
  <BodyContents
    className="markdown searchable rendered-content"
    dangerouslySetInnerHTML={{
      __html: children,
    }}
  />
)
