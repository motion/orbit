import * as React from 'react'
import { view } from '@mcro/black'
import { Masonry } from '../../views/Masonry'
import { OrbitCard } from './orbitCard'

export const OrbitCardMasonry = view.attach('appStore')(
  ({ items, appStore, ...props }) => (
    <Masonry {...props}>
      {items.map((result, index) => (
        <OrbitCard
          key={`${result.id}`}
          bit={result}
          index={index}
          total={items.length}
          appStore={appStore}
        />
      ))}
    </Masonry>
  ),
)
