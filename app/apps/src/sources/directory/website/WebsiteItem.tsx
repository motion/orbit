import { Markdown, OrbitItemViewProps } from '@mcro/kit'
import * as React from 'react'

export class WebsiteItem extends React.Component<OrbitItemViewProps<'website'>> {
  render() {
    return <Markdown source={this.props.item.body} />
  }
}
