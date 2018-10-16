import { WebsiteBitData } from '@mcro/models'
import { Block } from '@mcro/ui'
import * as React from 'react'
import { PeekBitPaneProps } from './PeekBitPaneProps'
import { view } from '@mcro/black'

const BitTitle = view({
  fontSize: 14,
  lineHeight: 20,
  fontWeight: 500,
  padding: 20,
  paddingBottom: 0,
})

export const Website = ({ bit }: PeekBitPaneProps) => {
  return (
    <>
      <BitTitle>{bit.title}</BitTitle>
      <Block className="website-body" dangerouslySetInnerHTML={{ __html: (bit.data as WebsiteBitData).content }} />
    </>
  )
}
