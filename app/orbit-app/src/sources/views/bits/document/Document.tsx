import * as React from 'react'
import { Title } from '../../../../views'
import { HighlightText } from '../../../../views/HighlightText'
import { HighlightTextItem } from '../../../../views/HighlightTextItem'
import { OrbitItemViewProps } from '../../../types'

export const Document = ({ bit, renderText, extraProps }: OrbitItemViewProps<any>) => {
  if (renderText) {
    return renderText(bit.body)
  }
  if (extraProps && extraProps.oneLine) {
    return <HighlightTextItem ellipse>{bit.body.slice(0, 200)}</HighlightTextItem>
  }
  return (
    <>
      <Title>{bit.title}</Title>
      <HighlightText>{bit.body}</HighlightText>
    </>
  )
}
