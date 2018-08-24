import * as React from 'react'
import { Masonry } from './Masonry'
import { OrbitCard } from './OrbitCard'

export const OrbitCardMasonry = ({ items, ...props }) => (
  <Masonry {...props}>
    {items.map((item, index) => (
      <OrbitCard key={`${item.id}`} model={item} index={index} />
    ))}
  </Masonry>
)
