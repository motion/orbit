import { view, react } from '@mcro/black'
import { OrbitSettingCard } from './orbitSettingCard'
import { OrbitGeneralSettings } from './orbitSettings/orbitGeneralSettings'
import { OrbitDockedPane } from './orbitDockedPane'
import { SubTitle } from '~/views'
import * as UI from '@mcro/ui'
import { Setting, Not, IsNull } from '@mcro/models'
import { allIntegrations } from '~/constants'
import { settingToResult } from '~/helpers'
import { modelQueryReaction } from '@mcro/helpers'

const IntegrationCard = props => (
  <OrbitSettingCard
    pane="summary"
    subPane="settings"
    hoverToSelect
    total={allIntegrations.length}
    listItem
    {...props}
  />
)

class OrbitSettingsStore {
  get isPaneActive() {
    return this.props.paneStore.activePane === this.props.name
  }

  setGetResults = react(
    () => [this.isPaneActive, this.integrationSettings],
    ([isActive, integrationSettings]) => {
      if (!isActive) {
        throw react.cancel
      }
      const getResults = () => integrationSettings
      getResults.shouldFilter = true
      this.props.appStore.setGetResults(getResults)
    },
    { immediate: true },
  )

  integrationSettings = modelQueryReaction(
    () =>
      Setting.find({
        where: { category: 'integration', token: Not(IsNull()) },
      }),
    {
      condition: () => this.isPaneActive,
      defaultValue: [],
    },
  )
}

@view.attach('appStore', 'paneStore')
@view({
  store: OrbitSettingsStore,
})
export class OrbitSettings {
  render({ name, store, appStore }) {
    const { integrationSettings } = store
    const isActive = result => {
      return !!integrationSettings.find(setting => setting.type === result.id)
    }
    console.log('rendering with settings', integrationSettings.map(s => s.id))
    return (
      <OrbitDockedPane name={name} fadeBottom>
        <OrbitGeneralSettings settingsStore={store} />
        <br />
        <section if={integrationSettings.length}>
          <SubTitle>Active Integrations</SubTitle>
          <cards>
            {integrationSettings.map((setting, index) => (
              <IntegrationCard
                key={`${setting.id}`}
                result={settingToResult(setting)}
                index={index}
                appStore={appStore}
                isActive
              />
            ))}
          </cards>
        </section>
        <section>
          <SubTitle>Add Integration</SubTitle>
          <cards>
            {allIntegrations
              .sort((a, b) => (!isActive(a) && isActive(b) ? -1 : 1))
              .map((item, index) => (
                <IntegrationCard
                  key={`${item.id}`}
                  result={item}
                  index={index + integrationSettings.length}
                  appStore={appStore}
                  titleProps={{
                    fontWeight: 300,
                  }}
                />
              ))}
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
