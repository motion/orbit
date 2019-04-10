import { HighlightText, ItemPropsContext } from '@o/ui'
import React from 'react'
import { OrbitItemViewProps } from '../types/OrbitItemViewProps'

export function BitGenericItem(rawProps: OrbitItemViewProps) {
  const itemProps = React.useContext(ItemPropsContext)
  const { item, shownLimit, oneLine, renderText } = { ...itemProps, ...rawProps }
  const body = `${item.body || ''}`
  if (renderText) {
    return renderText(body)
  }
  if (oneLine) {
    return (
      <HighlightText flex={1} ellipse>
        {body.slice(0, shownLimit || 150)}
      </HighlightText>
    )
  }
  // TODO fix multiline rendering
  return (
    <HighlightText flex={1} ellipse>
      {body.slice(0, shownLimit || 300)}
    </HighlightText>
  )
}
