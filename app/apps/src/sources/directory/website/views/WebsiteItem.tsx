import * as React from 'react'
import { OrbitItemViewProps } from '../../../types'
import { Markdown } from '../../../../views/Markdown'

export class WebsiteItem extends React.Component<OrbitItemViewProps<'website'>> {
  render() {
    return <Markdown source={this.props.item.body} />
  }
}
