import React, { useContext } from 'react'

import { HighlightText } from '../Highlight'
import { Title } from '../text/Title'
import { ItemPropsContext, ItemsPropsContextType } from './ItemPropsContext'

export type DocumentProps = Partial<ItemsPropsContextType> & {
  body: string
  title: string
}

export function Document(rawProps: DocumentProps) {
  const itemProps = useContext(ItemPropsContext)
  const { oneLine, renderText, body, title } = { ...itemProps, ...rawProps }
  if (renderText) {
    return renderText(body)
  }
  if (oneLine) {
    return <HighlightText ellipse>{body.slice(0, 200)}</HighlightText>
  }
  return (
    <>
      <Title>{title}</Title>
      <HighlightText whiteSpace="pre-line">{body}</HighlightText>
    </>
  )
}
