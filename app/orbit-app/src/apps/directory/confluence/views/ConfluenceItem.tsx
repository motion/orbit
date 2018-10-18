import * as React from 'react'
import { OrbitAppProps } from '../../../types'
import { Markdown } from '../../../../views/Markdown'

export class ConfluenceItem extends React.Component<OrbitAppProps<'confluence'>> {
  render() {
    return <Markdown source={this.props.bit.body} />
  }
}
