import * as React from 'react'
import { MarkdownBody } from '../../views/MarkdownBody'
import { PeekBitPaneProps } from './PeekBitPaneProps'

export const Document = ({ content }: PeekBitPaneProps) => {
  return <MarkdownBody>{content}</MarkdownBody>
}
