import * as React from 'react'
import { OrbitItemViewProps } from '../../../types'
import { Thread } from '../../../views/bits/thread/Thread'

export function GmailItem(props: OrbitItemViewProps<'gmail'>) {
  return <Thread {...props} />
}
