import * as React from 'react'
import { view } from '@mcro/black'
import { OrbitCard } from '~/apps/orbit/orbitCard'

@view.attach('appStore')
@view
export class Carousel extends React.Component {
  render({ items, appStore }) {
    return (
      <carousel>
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
      </carousel>
    )
  }

  static style = {
    carousel: {
      flexFlow: 'row',
      // padding: [0, 20],
      overflow: 'hidden',
      overflowX: 'scroll',
    },
  }
}
