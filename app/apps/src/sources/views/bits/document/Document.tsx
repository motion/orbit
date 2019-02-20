import { HighlightText } from '@mcro/ui'
import * as React from 'react'
import { ItemPropsContext } from '../../../../helpers/contexts/ItemPropsContext'
import { Title } from '../../../../views'
import { OrbitItemViewProps } from '../../../types'

export const Document = ({ item, renderText }: OrbitItemViewProps<any>) => {
  const itemProps = React.useContext(ItemPropsContext)

  if (renderText) {
    return renderText(item.body)
  }
  if (itemProps.oneLine) {
    return <HighlightText ellipse>{item.body.slice(0, 200)}</HighlightText>
  }
  return (
    <>
      <Title>{item.title}</Title>
      <HighlightText>{item.body}</HighlightText>
    </>
  )
}
