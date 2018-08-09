import * as React from 'react'
import { Masonry } from './Masonry'
import { OrbitCard } from './OrbitCard'

export const OrbitCardMasonry = ({ items, ...props }) => (
  <Masonry {...props}>
    {items.map((result, index) => (
      <OrbitCard
        key={`${result.id}`}
        bit={result}
        index={index}
        total={items.length}
      />
    ))}
  </Masonry>
)
