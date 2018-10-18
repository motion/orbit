import * as React from 'react'
import { OrbitAppProps } from '../../../types'
import { Markdown } from '../../../../views/Markdown'

export class JiraItem extends React.Component<OrbitAppProps<'jira'>> {
  render() {
    return <Markdown source={this.props.bit.body} />
  }
}
