import { view } from '@mcro/black'
import OrbitCard from '~/apps/orbit/orbitCard'

@view.attach('appStore')
@view
export default class Carousel {
  render({ items, appStore }) {
    return (
      <carousel>
        {items.map((item, index) => (
          <OrbitCard
            key={item.id}
            appStore={appStore}
            result={item}
            index={index}
            total={items.length}
            expanded={false}
            style={{
              width: 220,
              height: 200,
            }}
          />
        ))}
      </carousel>
    )
  }

  static style = {
    carousel: {
      flexFlow: 'row',
      padding: 20,
      overflowX: 'scroll',
    },
  }
}
