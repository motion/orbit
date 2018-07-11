import * as React from 'react'
import * as UI from '@mcro/ui'
import { OrbitCard } from '../apps/orbit/orbitCard'
import { view } from '@mcro/black'

const cardStyleDefault = {
  width: 200,
  height: 175,
  marginRight: 12,
}

export const Carousel = view.attach('appStore')(
  ({ items, appStore, cardStyle = {}, ...props }) => {
    return (
      <UI.Row overflow="hidden" overflowX="scroll" {...props}>
        {(items || []).map((bit, index) => (
          <OrbitCard
            key={`${index}${bit.id}`}
            pane="carousel"
            appStore={appStore}
            bit={bit}
            index={index}
            total={items.length}
            expanded={false}
            css={{
              ...cardStyleDefault,
              ...cardStyle,
            }}
          />
        ))}
      </UI.Row>
    )
  },
)
