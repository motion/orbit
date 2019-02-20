import { OrbitItemViewProps } from '@mcro/kit'
import * as React from 'react'
import { Thread } from '../../../views/bits/thread/Thread'

export function GmailItem(props: OrbitItemViewProps<'gmail'>) {
  return <Thread {...props} />
}
