import { HighlightText } from '@mcro/ui'
import * as React from 'react'
import { OrbitItemViewProps } from '../../types/OrbitItemViewProps'
import { ItemPropsContext } from './ItemPropsContext'
import { Markdown } from './Markdown'
import { HighlightSection, TaskComment, TaskCommentLike } from './TaskComment'

export type TaskLike = {
  body: string
  comments: TaskCommentLike[]
}

export function Task(rawProps: OrbitItemViewProps<any> & TaskLike) {
  const itemProps = React.useContext(ItemPropsContext)
  const { body, oneLine, renderText, comments } = { ...itemProps, ...rawProps }

  if (renderText) {
    return renderText(body)
  }
  if (oneLine) {
    return <HighlightText ellipse>{body.slice(0, 200)}</HighlightText>
  }
  return (
    <>
      <HighlightSection>
        <Markdown source={body} />
      </HighlightSection>
      {comments.map((comment, index) => (
        <TaskComment key={index} {...comment} />
      ))}
    </>
  )
}
