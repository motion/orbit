import * as React from 'react'
import { Title } from '../../../../views'
import { OrbitIntegrationProps } from '../../../types'
import { Markdown } from '../../../../views/Markdown'

export const MarkdownDocument = ({ bit, renderText }: OrbitIntegrationProps<any>) => {
  if (renderText) {
    return renderText(bit.body)
  }
  return (
    <>
      <Title>{bit.title}</Title>
      <Markdown source={bit.body} />
    </>
  )
}
