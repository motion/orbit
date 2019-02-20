import { OrbitItemViewProps } from '@mcro/kit'
import * as React from 'react'
import { MarkdownDocument } from '../../../views/bits/document/MarkdownDocument'

export function ConfluenceItem(props: OrbitItemViewProps<'confluence'>) {
  return <MarkdownDocument {...props} />
}
