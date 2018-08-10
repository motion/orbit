import * as React from 'react'
import { MarkdownBody } from '../../views/MarkdownBody'
import { PeekBitPaneProps } from './PeekBitPaneProps'
import { view } from '@mcro/black'

const BitTitle = view({
  fontSize: 16,
  lineHeight: 22,
  fontWeight: 600,
  padding: 20,
  paddingBottom: 0,
})

export const Document = ({ content, bit }: PeekBitPaneProps) => {
  return (
    <>
      <BitTitle>{bit.title}</BitTitle>
      <MarkdownBody>{content}</MarkdownBody>
    </>
  )
}
