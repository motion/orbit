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
    const [activeIntegrations, inactiveIntegrations] = partition(
      appStore.results,
      integration =>
        appStore.settings &&
        appStore.settings.find(x => x.type === integration.id && x.token),
    )
    // const allIntegrations = [...activeIntegrations, ...inactiveIntegrations]
    const integrationCard = all => (integration, index) => (
      <Card
        key={index}
        index={index}
        appStore={appStore}
        store={store}
        length={all.length}
        isActive={appStore.settings.find(
          x => x.type === integration.id && x.token,
        )}
        {...integration}
      />
    )
    return (
      <pane css={{ padding: 10 }}>
        <section if={activeIntegrations.length}>
          <Title>Active</Title>
          <cards>
            {activeIntegrations.map(integrationCard(activeIntegrations))}
          </cards>
        </section>
        <section if={inactiveIntegrations.length}>
          <Title>Inactive</Title>
          <cards>
            {inactiveIntegrations.map((item, index) =>
              integrationCard(inactiveIntegrations)(
                item,
                index + activeIntegrations.length,
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
