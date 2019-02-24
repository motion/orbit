import { MarkdownItem, OrbitItemViewProps } from '@mcro/kit'
import * as React from 'react'

export function JiraItem(props: OrbitItemViewProps<'jira'>) {
  return <MarkdownItem {...props} />
}
