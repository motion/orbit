import { view } from '@mcro/black'
import { App, Electron } from '@mcro/all'
import { partition } from 'lodash'
import Card from './orbitCard'
import * as UI from '@mcro/ui'

const Title = props => (
  <UI.Title size={1.1} fontWeight={600} margin={[10, 0]} {...props} />
)

class SettingsStore {
  refs = {}

  showPeek(index) {
    const ref = this.refs[index]
    if (!ref) return
    const position = {
      left: Electron.orbitState.position[0],
      top: ref.offsetTop + Electron.orbitState.position[1],
      width: Electron.orbitState.size[0] - 36,
      height: ref.clientHeight,
    }
    App.setPeekTarget({
      id: this.props.appStore.results[index],
      position,
      type: 'setting',
    })
  }
}

@view.attach('appStore')
@view({
  store: SettingsStore,
})
export default class OrbitSettings {
  render({ store, appStore }) {
    if (!appStore.settings) {
      return null
    }
    const isActive = integration =>
      appStore.settings[integration.id] &&
      appStore.settings[integration.id].token
    const [activeIntegrations, inactiveIntegrations] = partition(
      appStore.results,
      isActive,
    )
    const integrationCard = all => (integration, index, offset) => (
      <Card
        key={index}
        index={index}
        offset={offset}
        appStore={appStore}
        store={store}
        length={all.length}
        isActive={isActive(integration)}
        {...integration}
      />
    )
    return (
      <pane css={{ padding: 10 }}>
        <section if={activeIntegrations.length}>
          <Title>Active</Title>
          <cards>
            {activeIntegrations.map((item, index) =>
              integrationCard(activeIntegrations)(item, index, index),
            )}
          </cards>
        </section>
        <section if={inactiveIntegrations.length}>
          <Title>Inactive</Title>
          <cards>
            {inactiveIntegrations.map((item, index) =>
              integrationCard(inactiveIntegrations)(
                item,
                index + activeIntegrations.length,
                index,
              ),
            )}
          </cards>
        </section>
      </pane>
    )
  }

  static style = {
    cards: {
      flexFlow: 'row',
      flexWrap: 'wrap',
      userSelect: 'none',
      marginBottom: 20,
    },
  }
}
