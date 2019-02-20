import * as React from 'react'
import { OrbitItemViewProps } from '../../../types'
import { MarkdownDocument } from '../../../views/bits/document/MarkdownDocument'

export function JiraItem(props: OrbitItemViewProps<'jira'>) {
  return <MarkdownDocument {...props} />
}
