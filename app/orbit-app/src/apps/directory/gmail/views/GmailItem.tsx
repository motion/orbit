import * as React from 'react'
import { OrbitAppProps } from '../../../types'
import { Thread } from '../../../views/bits/thread/Thread'
import { Markdown } from '../../../../views/Markdown'

export class GmailItem extends React.Component<OrbitAppProps<'gmail'>> {
  render() {
    const { bit, extraProps = {} } = this.props
    if (extraProps.minimal) {
      return <Markdown source={bit.body} />
    }
    return <Thread bit={bit} />
  }
}
