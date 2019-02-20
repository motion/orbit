import * as React from 'react'
import { ItemPropsContext } from '../../../../helpers/contexts/ItemPropsContext'
import { Title } from '../../../../views'
import { Markdown } from '../../../../views/Markdown'
import { OrbitItemViewProps } from '../../../types'

export const MarkdownDocument = (rawProps: OrbitItemViewProps<any>) => {
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
