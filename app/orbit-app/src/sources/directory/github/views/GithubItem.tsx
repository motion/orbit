import * as React from 'react'
import { OrbitItemViewProps } from '../../../types'
import { Task } from '../../../views/bits/task/Task'

export class GithubItem extends React.Component<OrbitItemViewProps<'github'>> {
  render() {
    const { item } = this.props
    if (!item) {
      return null
    }
    return <Task {...this.props} body={item.body} comments={item.data.comments} />
  }
}
