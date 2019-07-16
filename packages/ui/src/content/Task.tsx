import React, { useContext } from 'react'

import { HighlightText } from '../Highlight'
import { ItemPropsContext } from './ItemPropsContext'
import { Markdown } from './Markdown'
import { HighlightSection, TaskComment, TaskCommentLike } from './TaskComment'

export type TaskLike = {
  body: string
  comments: TaskCommentLike[]
}

export function Task(rawProps: TaskLike) {
  const itemProps = useContext(ItemPropsContext)
  const { body, oneLine, renderText, comments } = { ...itemProps, ...rawProps }
  if (renderText) {
    return renderText(body)
  }
  if (oneLine) {
    return <HighlightText ellipse>{body.slice(0, 200)}</HighlightText>
  }
  if (!comments) {
    console.warn('why no comments for Task?', rawProps)
  }
  return (
    <>
      <HighlightSection>
        <Markdown source={body} />
      </HighlightSection>
      {(comments || []).map((comment, index) => (
        <TaskComment key={index} {...comment} />
      ))}
    </>
  )
}
