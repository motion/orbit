import * as React from 'react'
import { Markdown } from '../../../../views/Markdown'
import { TaskComment, TaskCommentLike } from './TaskComment'

export type TaskLike = {
  body: string
  comments: TaskCommentLike[]
}

export const Task = ({ body, comments }) => {
  return (
    <>
      <Markdown source={body} />
      {comments.map((comment, index) => (
        <TaskComment key={index} {...comment} />
      ))}
    </>
  )
}
