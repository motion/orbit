import * as React from 'react'
import { Title } from '../../../../views'
import { OrbitIntegrationProps } from '../../../types'
import { HighlightText } from '../../../../views/HighlightText'

export const Document = ({ bit, renderText }: OrbitIntegrationProps<any>) => {
  if (renderText) {
    return renderText(bit.body)
  }
  return (
    <>
      <Title>{bit.title}</Title>
      <HighlightText>{bit.body}</HighlightText>
    </>
  )
}
