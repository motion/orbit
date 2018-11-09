import * as React from 'react'
import { OrbitIntegrationProps } from '../../../types'
import { MarkdownDocument } from '../../../views/bits/document/MarkdownDocument'

export function JiraItem(props: OrbitIntegrationProps<'jira'>) {
  return <MarkdownDocument {...props} />
}
