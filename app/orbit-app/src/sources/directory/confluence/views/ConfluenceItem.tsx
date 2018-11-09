import * as React from 'react'
import { OrbitIntegrationProps } from '../../../types'
import { MarkdownDocument } from '../../../views/bits/document/MarkdownDocument'

export function ConfluenceItem(props: OrbitIntegrationProps<'confluence'>) {
  return <MarkdownDocument {...props} />
}
