import * as React from 'react'
import { Markdown } from '../../../../views/Markdown'
import { TaskComment, TaskCommentLike } from './TaskComment'
import { OrbitItemViewProps } from '../../../types'
import { HighlightTextItem } from '../../../../views/HighlightTextItem'

export type TaskLike = {
  body: string
  comments: TaskCommentLike[]
}

export const Task = ({
  body,
  comments,
  renderText,
  extraProps,
}: OrbitItemViewProps<any> & TaskLike) => {
  if (renderText) {
    return renderText(body)
  }
  if (extraProps && extraProps.oneLine) {
    return <HighlightTextItem>{body.slice(0, 200)}</HighlightTextItem>
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
