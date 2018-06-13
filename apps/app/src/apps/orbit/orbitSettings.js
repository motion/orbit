import { view, react } from '@mcro/black'
import { OrbitSettingCard } from './orbitSettingCard'
import { OrbitCard } from './orbitCard'
import { OrbitDockedPane } from './orbitDockedPane'
import { SubTitle } from '~/views'
import * as UI from '@mcro/ui'
import { now } from 'mobx-utils'
import { Setting, isAllEqual } from '@mcro/models'

const allIntegrations = [
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
      const getResults = () => this.activeIntegrations
      getResults.shouldFilter = true
      this.props.appStore.setGetResults(getResults)
    },
    { immediate: true },
  )

  // poll every 2 seconds while active
  activeIntegrations = react(
    () => this.isPaneActive && now(2000),
    async () => {
      const next = await Setting.find({ where: { type: 'integration' } })
      const current = this.activeIntegrations
      if (isAllEqual(current, next)) {
        console.log('all equal', current, next)
        throw react.cancel
      }
      return next
    },
    { defaultValue: [], log: false },
  )
}

@view.attach('appStore', 'paneStore')
@view({
  store: OrbitSettingsStore,
})
export class OrbitSettings {
  render({ name, store, appStore }) {
    const { activeIntegrations } = store
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
            You've added {activeIntegrations.length} integration{activeIntegrations.length ===
            '1'
              ? ''
              : 's'}.{' '}
            {activeIntegrations.length === 0
              ? 'Add some integrations below to get started with Orbit.'
              : ''}
          </UI.Text>
          <CheckBoxRow defaultChecked>Start on Login</CheckBoxRow>
          <CheckBoxRow defaultChecked>
            Automatically manage disk space
          </CheckBoxRow>
        </OrbitCard>
        <section if={activeIntegrations.length}>
          <SubTitle>Active Integrations</SubTitle>
          <cards>
            {activeIntegrations.map((item, index) => (
              <IntegrationCard
                key={`${index}-${item.id}`}
                result={item}
                index={index}
                isActive
              />
            ))}
          </cards>
        </section>
        <section>
          <SubTitle>Add Integration</SubTitle>
          <cards>
            {allIntegrations.map((item, index) => (
              <IntegrationCard
                key={index}
                result={item}
                index={index + activeIntegrations.length}
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
