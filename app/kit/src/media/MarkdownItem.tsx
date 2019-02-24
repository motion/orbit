import { Title } from '@mcro/ui'
import * as React from 'react'
import { ItemPropsContext } from '../media/ItemPropsContext'
import { Markdown } from '../media/Markdown'
import { OrbitItemViewProps } from '../types/OrbitItemViewProps'

export const MarkdownItem = (rawProps: OrbitItemViewProps<any>) => {
  const itemProps = React.useContext(ItemPropsContext)
  const { item, renderText } = { ...itemProps, ...rawProps }

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
