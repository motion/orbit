import * as React from 'react'
import { OrbitIntegrationProps } from '../../../types'
import { Markdown } from '../../../../views/Markdown'

export class WebsiteItem extends React.Component<OrbitIntegrationProps<'website'>> {
  render() {
    return <Markdown source={this.props.bit.body} />
  }
}
