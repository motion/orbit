import * as React from 'react'
import { ItemPropsContext } from '../../../../helpers/contexts/ItemPropsContext'
import { HighlightTextItem } from '../../../../views/HighlightTextItem'
import { Markdown } from '../../../../views/Markdown'
import { OrbitItemViewProps } from '../../../types'
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
    return <HighlightTextItem ellipse>{body.slice(0, 200)}</HighlightTextItem>
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
