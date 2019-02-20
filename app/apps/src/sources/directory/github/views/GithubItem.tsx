import * as React from 'react'
import { OrbitItemViewProps } from '../../../types'
import { Task } from '../../../views/bits/task/Task'

export function GithubItem({ item, ...rest }: OrbitItemViewProps<'github'>) {
  if (!item) {
    return null
  }
  return <Task {...rest} body={item.body} comments={item.data.comments} />
}
