import * as React from 'react'
import * as UI from '@mcro/ui'
import { OrbitCard } from '../apps/orbit/orbitCard'

export const Carousel = ({ items, appStore }) => {
  return (
    <UI.Row overflow="hidden" overflowX="scroll">
      {(items || []).map((bit, index) => (
        <OrbitCard
          key={`${index}${bit.id}`}
          pane="carousel"
          appStore={appStore}
          bit={bit}
          index={index}
          total={items.length}
          expanded={false}
          style={{
            width: 200,
            height: 175,
            marginRight: 12,
          }}
        />
      ))}
    </UI.Row>
  )
}
