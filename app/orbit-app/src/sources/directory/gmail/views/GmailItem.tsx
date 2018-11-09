import * as React from 'react'
import { OrbitIntegrationProps } from '../../../types'
import { Thread } from '../../../views/bits/thread/Thread'

export function GmailItem(props: OrbitIntegrationProps<'gmail'>) {
  return <Thread {...props} />
}
