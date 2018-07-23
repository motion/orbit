import * as React from 'react'
import { Masonry } from '../../views/Masonry'
import { OrbitCard } from './OrbitCard'
import * as UI from '@mcro/ui'

export const OrbitCardMasonry = ({ items, searchStore, ...props }) => (
  <UI.Theme name="grey">
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
  </UI.Theme>
)
