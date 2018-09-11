import * as React from 'react'
import { MarkdownBody } from '../../views/MarkdownBody'
import { PeekBitPaneProps } from './PeekBitPaneProps'
import { view } from '@mcro/black'

const BitTitle = view({
  fontSize: 14,
  lineHeight: 20,
  fontWeight: 500,
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
