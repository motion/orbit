import { view, watch } from '@mcro/black'
import * as UI from '@mcro/ui'
import { Bit } from '@mcro/models'
// import { App, Desktop, Electron } from '@mcro/all'

// @view.attach('appStore')
@view({
  store: class HeadsUpStore {
    updateInterval = 1

    @watch
    recently = () =>
      this.updateInterval && Bit.find({ order: { createdAt: 'DESC' }, take: 5 })

    willMount() {
      this.setInterval(() => {
        this.updateInterval = Date.now()
      }, 4000)
    }
  },
})
export default class OrbitHeadsUp {
  render({ store, getHoverProps }) {
    return (
      <headsUp if={store.recently}>
        {store.recently.map((bit, index) => (
          <item
            key={bit.id}
            {...getHoverProps({
              bit,
              id: index,
            })}
          >
            <UI.Title size={0.95} ellipse>
              {bit.title}
            </UI.Title>
            <UI.Date if={false} css={{ opacity: 0.5 }}>
              {bit.bitUpdatedAt}
            </UI.Date>
          </item>
        ))}
      </headsUp>
    )
  }

  static style = {
    headsUp: {
      padding: [10, 0],
    },
    item: {
      padding: [5, 15],
      flexFlow: 'row',
    },
  }
}
