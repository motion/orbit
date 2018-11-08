import * as React from 'react'
import { OrbitIntegrationProps } from '../../../types'
import { Markdown } from '../../../../views/Markdown'

export class JiraItem extends React.Component<OrbitIntegrationProps<'jira'>> {
  render() {
    return <Markdown source={this.props.bit.body} />
  }
}
