import * as React from 'react'
import { view } from '@mcro/black'
import { PeekBitPaneProps } from './PeekBitPaneProps'

const BodyContents = view({
  whiteSpace: 'pre-line',
  padding: 22,
  fontSize: 16,
  lineHeight: 22,
  overflow: 'hidden',
})

export const Task = ({ content, comments }: PeekBitPaneProps) => {
  return (
    <>
      <BodyContents
        className="markdown searchable rendered-content"
        dangerouslySetInnerHTML={{
          __html: content,
        }}
      />
      <BodyContents>{comments}</BodyContents>
    </>
  )
}
