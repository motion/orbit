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

const Row = view('section', {
  flexFlow: 'row',
  padding: [8, 0],
  alignItems: 'center',
})

const InputRow = ({ label }) => (
  <Row>
    <label css={{ padding: [0, 4], fontWeight: 400 }}>{label}</label>
    <input css={{ fontSize: 14, padding: [4, 6], margin: ['auto', 8] }} />{' '}
  </Row>
)

const CheckBoxRow = ({ children, checked }) => (
  <Row>
    <input checked={checked} css={{ margin: ['auto', 4] }} type="checkbox" />{' '}
    <label css={{ padding: [0, 4], fontWeight: 400 }}>{children}</label>
  </Row>
)

class OrbitSettingsStore {
  isPaneActive = false

  setGetResults = react(
    () => [
      this.props.paneStore.activePane === this.props.name,
      this.activeSettings,
    ],
    ([isActive, activeSettings]) => {
      this.isPaneActive = isActive
      if (!isActive) {
        throw react.cancel
      }
      const getResults = () => activeSettings
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
    const isActive = result => {
      return !!activeSettings.find(setting => setting.type === result.id)
    }
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
      <OrbitDockedPane name={name} fadeBottom>
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
          <CheckBoxRow if={false} defaultChecked>
            Automatically manage disk space
          </CheckBoxRow>
          <InputRow label="Open shortcut" />
        </OrbitCard>
        <br />
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
              .sort((a, b) => (!isActive(a) && isActive(b) ? -1 : 1))
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
