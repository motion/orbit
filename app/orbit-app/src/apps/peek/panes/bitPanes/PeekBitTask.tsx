import * as React from 'react'
import { view } from '@mcro/black'
import { PeekBitPaneProps } from './PeekBitPaneProps'

const BodyContents = view({
  display: 'block',
  padding: [18, 22],
  fontSize: 16,
  lineHeight: 24,
  overflow: 'hidden',
})

export const Task = ({ content, comments }: PeekBitPaneProps) => {
  return (
    <>
      <BodyContents>{content}</BodyContents>
      <BodyContents>{comments}</BodyContents>
    </>
  )
}
