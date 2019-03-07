import { normalizeItem } from '@o/kit'
import { Card } from '@o/ui'
import * as React from 'react'
import { Masonry } from './Masonry'

export const OrbitCardMasonry = ({ items, ...props }) => (
  <Masonry {...props}>
    {items.map((item, index) => (
      <Card key={`${item.id}`} {...normalizeItem(item)} index={index} />
    ))}
  </Masonry>
)
