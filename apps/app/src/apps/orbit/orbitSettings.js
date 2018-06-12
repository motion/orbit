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
    const {
      activeIntegrations,
      inactiveIntegrations,
    } = store.splitActiveResults
    const integrationCard = all => (result, index, offset) => (
      <OrbitSettingCard
        key={index}
        index={index}
        offset={offset}
        appStore={appStore}
        length={all.length}
        isActive={store.isActive(result)}
        isPaneActive={store.isPaneActive}
        setting={appStore.settings[result.id]}
        result={result}
      />
    )
    return (
      <OrbitDockedPane name={name}>
        <section if={activeIntegrations.length}>
          <SubTitle>Integrations</SubTitle>
          <cards>
            {activeIntegrations.map((item, index) =>
              integrationCard(activeIntegrations)(item, index, index),
            )}
          </cards>
        </section>
        <section if={inactiveIntegrations.length}>
          <SubTitle>Add Integration</SubTitle>
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
    section: {
      margin: [0, -4],
    },
  }
}
