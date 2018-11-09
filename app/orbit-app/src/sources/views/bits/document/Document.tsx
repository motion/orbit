import * as React from 'react'
import { Title } from '../../../../views'
import { OrbitIntegrationProps } from '../../../types'
import { HighlightText } from '../../../../views/HighlightText'

export const Document = ({
  title,
  body,
  renderText,
}: OrbitIntegrationProps<any> & { title: string; body: string }) => {
  if (renderText) {
    return renderText(body)
  }
  return (
    <>
      <Title>{title}</Title>
      <HighlightText>{body}</HighlightText>
    </>
  )
}
