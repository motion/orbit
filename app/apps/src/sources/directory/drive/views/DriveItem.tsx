import * as React from 'react'
import { OrbitItemViewProps } from '../../../types'
import { MarkdownDocument } from '../../../views/bits/document/MarkdownDocument'

export function DriveItem(props: OrbitItemViewProps<'drive'>) {
  return <MarkdownDocument {...props} />
}
