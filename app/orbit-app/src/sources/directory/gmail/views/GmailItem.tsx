import * as React from 'react'
import { OrbitIntegrationProps } from '../../../types'
import { Thread } from '../../../views/bits/thread/Thread'
import { HighlightText } from '../../../../views/HighlightText'

export class GmailItem extends React.Component<OrbitIntegrationProps<'gmail'>> {
  render() {
    const { bit, extraProps = {} } = this.props
    if (extraProps.minimal) {
      return <HighlightText>{bit.body}</HighlightText>
    }
    return <Thread bit={bit} />
  }
}
