import { HighlightText, Stack, Title } from '@o/ui'
import React, { useContext } from 'react'

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
    <Stack space>
      <Title>{title}</Title>
      <HighlightText size={1.15} whiteSpace="pre-line" selectable>
        {body}
      </HighlightText>
    </Stack>
  )
}
