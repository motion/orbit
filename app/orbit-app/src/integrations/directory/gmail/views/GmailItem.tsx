import * as React from 'react'
import { OrbitIntegrationProps } from '../../../types'
import { Thread } from '../../../views/bits/thread/Thread'
import { Markdown } from '../../../../views/Markdown'

export class GmailItem extends React.Component<OrbitIntegrationProps<'gmail'>> {
  render() {
    const { bit, extraProps = {} } = this.props
    if (extraProps.minimal) {
      return <Markdown source={bit.body} />
    }
    return <Thread bit={bit} />
  }
}
