import { MarkdownDocument, OrbitItemViewProps } from '@mcro/kit'
import * as React from 'react'

export function DriveItem(props: OrbitItemViewProps<'drive'>) {
  return <MarkdownDocument {...props} />
}
