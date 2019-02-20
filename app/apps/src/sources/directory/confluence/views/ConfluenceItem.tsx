import { MarkdownDocument, OrbitItemViewProps } from '@mcro/kit'
import * as React from 'react'

export function ConfluenceItem(props: OrbitItemViewProps<'confluence'>) {
  return <MarkdownDocument {...props} />
}
