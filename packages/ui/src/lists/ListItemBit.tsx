import React from 'react'

import { ItemPropsContext } from '../content/ItemPropsContext'
import { HighlightText } from '../Highlight'

// TODO type this...

export function ListItemBit(rawProps: any) {
  const itemProps = React.useContext(ItemPropsContext)
  const { item, shownLimit, oneLine, renderText } = { ...itemProps, ...rawProps } as any
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
