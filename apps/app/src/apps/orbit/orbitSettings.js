import { view, react } from '@mcro/black'
import { partition } from 'lodash'
import { OrbitSettingCard } from './orbitSettingCard'
import { OrbitDockedPane } from './orbitDockedPane'
import { SubTitle } from '~/views'

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
      const getResults = () => this.splitActiveResults.activeIntegrations
      getResults.shouldFilter = true
      this.props.appStore.setGetResults(getResults)
    },
    { immediate: true },
  )

  isActive = result =>
    this.props.appStore.settings[result.id] &&
    this.props.appStore.settings[result.id].token

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
      title: 'Local Files',
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
    const {
      activeIntegrations,
      inactiveIntegrations,
    } = store.splitActiveResults
    const integrationCard = (result, index) => (
      <OrbitSettingCard
        pane="summary"
        subPane="settings"
        hoverToSelect
        key={index}
        index={index}
        total={store.allResults.length}
        appStore={appStore}
        isActive={store.isActive(result)}
        setting={appStore.settings[result.id]}
        result={result}
        listItem
      />
    )
    return (
      <OrbitDockedPane name={name}>
        <section if={activeIntegrations.length}>
          <SubTitle>Integrations</SubTitle>
          <cards>
            {activeIntegrations.map((item, index) =>
              integrationCard(item, index),
            )}
          </cards>
        </section>
        <section if={inactiveIntegrations.length}>
          <SubTitle>Add Integration</SubTitle>
          <cards>
            {inactiveIntegrations.map((item, index) =>
              integrationCard(item, index + activeIntegrations.length),
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
