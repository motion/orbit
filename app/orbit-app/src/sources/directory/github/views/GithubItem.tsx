import * as React from 'react'
import { OrbitIntegrationProps } from '../../../types'
import { Task } from '../../../views/bits/task/Task'

export class GithubItem extends React.Component<OrbitIntegrationProps<'github'>> {
  render() {
    const { bit } = this.props
    if (!bit) {
      return null
    }
    return (
      <>
        <Task {...this.props} body={bit.body} comments={bit.data.comments} />
      </>
    )
  }
}
