import * as React from 'react'
import { OrbitIntegrationProps } from '../../../types'
import { MarkdownDocument } from '../../../views/bits/document/MarkdownDocument'

export function DriveItem(props: OrbitIntegrationProps<'drive'>) {
  return <MarkdownDocument {...props} />
}
