import { view, react } from '@mcro/black'
import { OrbitSettingCard } from './orbitSettingCard'
import { OrbitCard } from './orbitCard'
import { OrbitDockedPane } from './orbitDockedPane'
import { SubTitle } from '~/views'
import * as UI from '@mcro/ui'
import { Setting, Not, IsNull } from '@mcro/models'
import { allIntegrations } from '~/constants'
import { settingToResult } from '~/helpers'
import { modelQueryReaction } from '@mcro/helpers'

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
      const getResults = () => this.activeSettings
      getResults.shouldFilter = true
      this.props.appStore.setGetResults(getResults)
    },
    { immediate: true },
  )

  // poll every 2 seconds while active
  activeSettings = modelQueryReaction(
    () =>
      Setting.find({
        where: { category: 'integration', token: Not(IsNull()) },
      }),
    {
      condition: () => this.isPaneActive,
    },
  )
}

@view.attach('appStore', 'paneStore')
@view({
  store: OrbitSettingsStore,
})
export class OrbitSettings {
  render({ name, store, appStore }) {
    const { activeSettings } = store
    const isActive = a =>
      activeSettings.indexOf(setting => setting.type === a.type) > -1
    const IntegrationCard = props => (
      <OrbitSettingCard
        pane="summary"
        subPane="settings"
        hoverToSelect
        total={allIntegrations.length}
        appStore={appStore}
        listItem
        {...props}
      />
    )
    return (
      <OrbitDockedPane name={name}>
        <SubTitle>Settings</SubTitle>
        <OrbitCard>
          <UI.Text css={{ marginBottom: 10 }}>
            You've added {activeSettings.length} integration{activeSettings.length ===
            '1'
              ? ''
              : 's'}.{' '}
            {activeSettings.length === 0
              ? 'Add some integrations below to get started with Orbit.'
              : ''}
          </UI.Text>
          <CheckBoxRow defaultChecked>Start on Login</CheckBoxRow>
          <CheckBoxRow defaultChecked>
            Automatically manage disk space
          </CheckBoxRow>
        </OrbitCard>
        <section if={activeSettings.length}>
          <SubTitle>Active Integrations</SubTitle>
          <cards>
            {activeSettings.map((setting, index) => (
              <IntegrationCard
                key={setting.id}
                result={settingToResult(setting)}
                index={index}
                isActive
              />
            ))}
          </cards>
        </section>
        <section>
          <SubTitle>Add Integration</SubTitle>
          <cards>
            {allIntegrations
              .sort((a, b) => (isActive(a) && !isActive(b) ? 1 : -1))
              .map((item, index) => (
                <IntegrationCard
                  key={index}
                  result={item}
                  index={index + activeSettings.length}
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
