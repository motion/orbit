import * as React from 'react'
import { Markdown } from '../../../../views/Markdown'
import { TaskComment, TaskCommentLike } from './TaskComment'
import { OrbitIntegrationProps } from '../../../types'

export type TaskLike = {
  body: string
  comments: TaskCommentLike[]
}

export const Task = ({ body, comments, renderText }: OrbitIntegrationProps<any> & TaskLike) => {
  if (renderText) {
    return renderText(body)
  }
  return (
    <>
      <Markdown source={body} />
      {comments.map((comment, index) => (
        <TaskComment key={index} {...comment} />
      ))}
    </>
  )
}
