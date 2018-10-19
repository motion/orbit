import * as React from 'react'
import { OrbitAppProps } from '../../../types'
import { Markdown } from '../../../../views/Markdown'

export class WebsiteItem extends React.Component<OrbitAppProps<'website'>> {
  render() {
    return <Markdown source={this.props.bit.body} />
  }
}
