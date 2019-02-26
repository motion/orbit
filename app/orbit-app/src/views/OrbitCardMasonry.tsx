import { Card } from '@mcro/ui'
import * as React from 'react'
import { Masonry } from './Masonry'

export const OrbitCardMasonry = ({ items, ...props }) => (
  <Masonry {...props}>
    {items.map((item, index) => (
      <Card key={`${item.id}`} model={item} index={index} />
    ))}
  </Masonry>
)
