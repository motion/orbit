import * as React from 'react'
import { HighlightTextItem } from '../../../../views/HighlightTextItem'
import { Markdown } from '../../../../views/Markdown'
import { OrbitItemViewProps } from '../../../types'
import { TaskComment, TaskCommentLike } from './TaskComment'

export type TaskLike = {
  body: string
  comments: TaskCommentLike[]
}

export function Task({
  body,
  comments,
  renderText,
  extraProps,
}: OrbitItemViewProps<any> & TaskLike) {
  if (renderText) {
    return renderText(body)
  }
  if (extraProps && extraProps.oneLine) {
    return <HighlightTextItem ellipse>{body.slice(0, 200)}</HighlightTextItem>
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
