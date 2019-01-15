import * as React from 'react'
import { Title } from '../../../../views'
import { OrbitIntegrationProps } from '../../../types'
import { Markdown } from '../../../../views/Markdown'

export const MarkdownDocument = ({ item, renderText }: OrbitIntegrationProps<any>) => {
  if (renderText) {
    return renderText(item.body)
  }
  return (
    <>
      <Title>{item.title}</Title>
      <Markdown source={item.body} />
    </>
  )
}
