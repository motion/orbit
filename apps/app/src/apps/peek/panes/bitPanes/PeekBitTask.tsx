import * as React from 'react'
import { view, compose } from '@mcro/black'
import { PeekBitPaneProps } from './PeekBitPaneProps'

const BodyContents = view({
  whiteSpace: 'pre-line',
  padding: 20,
  fontSize: 16,
  lineHeight: 22,
  overflow: 'hidden',
})

export const Task = ({ content, comments }: PeekBitPaneProps) => {
  return (
    <>
      <BodyContents
        className="markdown searchable"
        dangerouslySetInnerHTML={{
          __html: content,
        }}
      />
      <BodyContents>{comments}</BodyContents>
      <br />
      <br />
    </>
  )
}
