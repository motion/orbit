import * as React from 'react'
import { OrbitAppProps } from '../../../types'
import { Thread } from '../../../views/bits/thread/Thread'

export class GmailItem extends React.Component<OrbitAppProps<'gmail'>> {
  render() {
    const { bit } = this.props
    return <Thread bit={bit} />
  }
}
