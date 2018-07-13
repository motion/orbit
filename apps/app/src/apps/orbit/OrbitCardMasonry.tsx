import * as React from 'react'
import { view } from '@mcro/black'
import { Masonry } from '../../views/Masonry'
import { OrbitCard } from './orbitCard'
import * as UI from '@mcro/ui'

export const OrbitCardMasonry = view.attach('appStore')(
  ({ items, appStore, ...props }) => (
    <UI.Theme name="grey">
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
    </UI.Theme>
  ),
)
