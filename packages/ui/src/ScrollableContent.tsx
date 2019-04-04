import { Col, ColProps, gloss } from '@o/gloss'
import * as React from 'react'

// TODO not a great view

const PeekContentChrome = gloss(Col, {
  flex: 1,
  position: 'relative',
  // without this, things strangely overflow
  overflow: 'hidden',
})

const ContentInner = gloss(Col, {
  overflowX: 'auto',
  overflowY: 'auto',
  flex: 1,
  lineHeight: '1.6rem',
  wordBreak: 'break-word',
})

export function ScrollableContent({ scrollTo, ...props }: ColProps & { scrollTo?: string }) {
  return (
    <PeekContentChrome>
      <ContentInner {...props} />
    </PeekContentChrome>
  )
}
