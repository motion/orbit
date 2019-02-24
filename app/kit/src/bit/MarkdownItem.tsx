import { Title } from '@mcro/ui'
import * as React from 'react'
import { OrbitItemViewProps } from '../types/OrbitItemViewProps'
import { ItemPropsContext } from './ItemPropsContext'
import { Markdown } from './Markdown'

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
