import { OrbitItemViewProps } from '@mcro/kit'
import * as React from 'react'
import { MarkdownDocument } from '../../../views/bits/document/MarkdownDocument'

export function DriveItem(props: OrbitItemViewProps<'drive'>) {
  return <MarkdownDocument {...props} />
}
