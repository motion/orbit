import { view, react } from '@mcro/black'
import { partition } from 'lodash'
import { OrbitSettingCard } from './orbitSettingCard'
import { OrbitDockedPane } from './orbitDockedPane'
import * as UI from '@mcro/ui'

const Title = props => (
  <UI.Title size={1.2} fontWeight={600} margin={[10, 20]} {...props} />
)

class OrbitSettingsStore {
  isPaneActive = false

  setGetResults = react(
    () => [
      this.props.paneStore.activePane === this.props.name,
      this.splitActiveResults,
    ],
    ([isActive]) => {
      this.isPaneActive = isActive
      if (!isActive) {
        throw react.cancel
      }
      this.props.appStore.setGetResults(
        () => this.splitActiveResults.activeIntegrations,
      )
    },
    { immediate: true },
  )

  isActive = integration =>
    this.props.appStore.settings[integration.id] &&
    this.props.appStore.settings[integration.id].token

  allResults = [
    {
      id: 'google',
      type: 'setting',
      integration: 'google',
      title: 'Google',
      icon: 'google',
    },
    {
      id: 'github',
      type: 'setting',
      integration: 'github',
      title: 'Github',
      icon: 'github',
    },
    {
      id: 'slack',
      type: 'setting',
      integration: 'slack',
      title: 'Slack',
      icon: 'slack',
    },
    {
      id: 'folder',
      type: 'setting',
      integration: 'folder',
      title: 'Folder',
      icon: 'folder',
      oauth: false,
    },
  ]

  get splitActiveResults() {
    const [activeIntegrations, inactiveIntegrations] = partition(
      this.allResults,
      this.isActive,
    )
    return { activeIntegrations, inactiveIntegrations }
  }
}

@view.attach('appStore', 'paneStore')
@view({
  store: OrbitSettingsStore,
})
export class OrbitSettings {
  render({ name, store, appStore }) {
    if (!appStore.settings) {
      return null
    }
    console.log('store.isPaneActive', store.isPaneActive)
    const {
      activeIntegrations,
      inactiveIntegrations,
    } = store.splitActiveResults
    const integrationCard = all => (setting, index, offset) => (
      <OrbitSettingCard
        key={index}
        index={index}
        offset={offset}
        appStore={appStore}
        length={all.length}
        isActive={store.isActive(setting)}
        isPaneActive={store.isPaneActive}
        setting={setting}
      />
    )
    return (
      <OrbitDockedPane name={name}>
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
      </OrbitDockedPane>
    )
  }

  static style = {
    cards: {
      userSelect: 'none',
      marginBottom: 10,
    },
  }
}
