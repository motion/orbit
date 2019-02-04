import * as React from 'react'
import { ItemPropsContext } from '../../../../helpers/contexts/ItemPropsContext'
import { Title } from '../../../../views'
import { HighlightText } from '../../../../views/HighlightText'
import { HighlightTextItem } from '../../../../views/HighlightTextItem'
import { OrbitItemViewProps } from '../../../types'

export const Document = ({ item, renderText }: OrbitItemViewProps<any>) => {
  const itemProps = React.useContext(ItemPropsContext)

  if (renderText) {
    return renderText(item.body)
  }
  if (itemProps.oneLine) {
    return <HighlightTextItem ellipse>{item.body.slice(0, 200)}</HighlightTextItem>
  }
  return (
    <>
      <Title>{item.title}</Title>
      <HighlightText>{item.body}</HighlightText>
    </>
  )
}
