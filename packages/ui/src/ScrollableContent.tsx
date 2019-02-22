import { Col, gloss, ViewProps } from '@mcro/gloss'
import * as React from 'react'

// TODO not a great view

const PeekContentChrome = gloss(Col, {
  flex: 1,
  position: 'relative',
  zIndex: 0,
  // without this, things strangely overflow
  overflow: 'hidden',
})

const ContentInner = gloss(Col, {
  overflowX: 'auto',
  overflowY: 'auto',
  flex: 1,
  fontSize: 16,
  lineHeight: '1.6rem',
  wordBreak: 'break-word',
})

export function ScrollableContent({ scrollTo, ...props }: ViewProps & { scrollTo?: string }) {
  return (
    <PeekContentChrome>
      <ContentInner {...props} />
    </PeekContentChrome>
  )
}
