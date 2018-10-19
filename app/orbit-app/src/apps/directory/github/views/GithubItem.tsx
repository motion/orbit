import * as React from 'react'
import { OrbitAppProps } from '../../../types'
import { Task } from '../../../views/bits/task/Task'

export class GithubItem extends React.Component<OrbitAppProps<'github'>> {
  render() {
    const { bit } = this.props
    if (!bit) {
      return null
    }
    return (
      <>
        <Task body={bit.body} comments={bit.data.comments} />
      </>
    )
  }
}
