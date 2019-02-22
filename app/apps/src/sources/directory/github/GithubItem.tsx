import { OrbitItemViewProps, Task } from '@mcro/kit'
import * as React from 'react'

export function GithubItem({ item, ...rest }: OrbitItemViewProps<'github'>) {
  if (!item) return null
  return <Task {...rest} body={item.body} comments={item.data.comments} />
}
