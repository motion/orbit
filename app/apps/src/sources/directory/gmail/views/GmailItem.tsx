import { OrbitItemViewProps, Thread } from '@mcro/kit'
import * as React from 'react'

export function GmailItem(props: OrbitItemViewProps<'gmail'>) {
  return <Thread {...props} />
}
