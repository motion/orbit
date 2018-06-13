import { view, react } from '@mcro/black'
import { partition } from 'lodash'
import { OrbitSettingCard } from './orbitSettingCard'
import { OrbitCard } from './orbitCard'
import { OrbitDockedPane } from './orbitDockedPane'
import { SubTitle } from '~/views'
import * as UI from '@mcro/ui'

const CheckBoxRow = ({ children, checked }) => (
  <row css={{ flexFlow: 'row', padding: [8, 0], alignItems: 'center' }}>
    <input checked={checked} css={{ margin: ['auto', 4] }} type="checkbox" />{' '}
    <label css={{ padding: [0, 4], fontWeight: 400 }}>{children}</label>
  </row>
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
    const { activeIntegrations } = store.splitActiveResults
    const integrationCard = (result, { index, ...props }) => (
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
        {...props}
      />
    )
    return (
      <OrbitDockedPane name={name}>
        <SubTitle>Settings</SubTitle>
        <OrbitCard>
          <UI.Text css={{ marginBottom: 10 }}>
            You've added {activeIntegrations.length} integration{activeIntegrations.length ===
            '1'
              ? ''
              : 's'}.{' '}
            {activeIntegrations.length === 0
              ? 'Add some integrations below to get started with Orbit.'
              : ''}
          </UI.Text>
          <CheckBoxRow checked>Start on Login</CheckBoxRow>
          <CheckBoxRow checked>Automatically manage disk space</CheckBoxRow>
        </OrbitCard>
        <section if={activeIntegrations.length}>
          <SubTitle>Active Integrations</SubTitle>
          <cards>
            {activeIntegrations.map((item, index) =>
              integrationCard(item, { index }),
            )}
          </cards>
        </section>
        <section>
          <SubTitle>Add Integration</SubTitle>
          <cards>
            {store.allResults.map((item, index) =>
              integrationCard(item, {
                index: index + activeIntegrations.length,
                isActive: false,
                titleProps: {
                  fontWeight: 300,
                },
              }),
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
