import * as React from 'react'
import { OrbitIntegrationProps } from '../../../types'
import { Markdown } from '../../../../views/Markdown'

export class ConfluenceItem extends React.Component<OrbitIntegrationProps<'confluence'>> {
  render() {
    return <Markdown source={this.props.bit.body} />
  }
}
