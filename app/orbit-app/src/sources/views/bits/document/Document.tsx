import * as React from 'react'
import { Title } from '../../../../views'
import { OrbitIntegrationProps } from '../../../types'
import { HighlightText } from '../../../../views/HighlightText'
import { HighlightTextItem } from '../../../../views/HighlightTextItem'

export const Document = ({ bit, renderText, extraProps }: OrbitIntegrationProps<any>) => {
  if (renderText) {
    return renderText(bit.body)
  }
  if (extraProps && extraProps.oneLine) {
    return <HighlightTextItem>{bit.body.slice(0, 200)}</HighlightTextItem>
  }
  return (
    <>
      <Title>{bit.title}</Title>
      <HighlightText>{bit.body}</HighlightText>
    </>
  )
}
