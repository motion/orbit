import * as React from 'react'
import { view, react } from '@mcro/black'
import { OrbitSettingCard } from './OrbitSettingCard'
import { SubPane } from './SubPane'
import * as Views from '../../views'
import { Setting, Not, IsNull, findOrCreate } from '@mcro/models'
import { modelQueryReaction } from '@mcro/helpers'
import { Masonry } from '../../views/Masonry'
import { App } from '@mcro/stores'
import { PaneManagerStore } from './PaneManagerStore'
import { IntegrationSettingsStore } from '../../stores/IntegrationSettingsStore'
import { SearchStore } from '../../stores/SearchStore'
import { API_URL } from '../../constants'

type Props = {
  name: string
  store?: OrbitSettingsStore
  searchStore?: SearchStore
  paneStore?: PaneManagerStore
  integrationSettingsStore?: IntegrationSettingsStore
}

class OrbitSettingsStore {
  props: Props

  setGetResults = react(
    () => [this.isPaneActive, this.allResults],
    async ([isActive, allResults], { sleep }) => {
      if (!isActive) {
        throw react.cancel
      }
      await sleep(40)
      const getResults = () => allResults
      this.props.searchStore.setGetResults(getResults)
    },
    { immediate: true },
  )

  get isPaneActive() {
    return this.props.paneStore.activePane === this.props.name
  }

  generalSettings = react(
    async () => {
      const settingQuery = [
        { type: 'general', category: 'general' },
        { type: 'account', category: 'general' },
      ]
      await findOrCreate(Setting, settingQuery[0])
      await findOrCreate(Setting, settingQuery[1])
      const settings = await Promise.all([
        Setting.findOne(settingQuery[0]),
        Setting.findOne(settingQuery[1]),
      ])
      return [
        {
          id: settings[0].id,
          type: 'setting',
          title: 'General',
          icon: 'gear',
          subtitle: 'Shortcuts, login and sync',
        },
        {
          id: settings[1].id,
          type: 'setting',
          title: 'Account',
          icon: 'users_single',
          subtitle: 'Login, invite your team',
        },
      ]
    },
    { defaultValue: [] },
  )

  get allResults() {
    return [...this.generalSettings, ...this.integrationSettings]
  }

  IntegrationCard = props => (
    <OrbitSettingCard
      pane="docked"
      subPane="settings"
      total={this.allResults.length}
      {...props}
    />
  )

  integrationSettings = modelQueryReaction(
    () =>
      Setting.find({
        where: {
          category: 'integration',
          token: Not(IsNull()),
          type: Not('setting'),
        },
      }),
    val => {
      if (!this.isPaneActive && this.integrationSettings.length) {
        throw react.cancel
      }
      return val
    },
    {
      defaultValue: [],
      log: true,
    },
  )
}

@view.attach('searchStore', 'paneStore', 'integrationSettingsStore')
@view.attach({
  store: OrbitSettingsStore,
})
@view
export class OrbitSettings extends React.Component<Props> {
  render() {
    const { name, store, integrationSettingsStore } = this.props
    const isActive = result => {
      return !!store.integrationSettings.find(
        setting => setting.type === result.id,
      )
    }
    return (
      <SubPane name={name} fadeBottom>
        <Views.SubTitle>Settings</Views.SubTitle>
        <Masonry>
          {store.generalSettings.map((result, index) => (
            <store.IntegrationCard
              key={`${result.id}`}
              result={result}
              index={index}
              subtitle={result.subtitle}
              isActive
            />
          ))}
        </Masonry>
        <Views.VertSpace />
        {!!store.integrationSettings.length && (
          <>
            <Views.SubTitle>Active Integrations</Views.SubTitle>
            <Masonry>
              {store.integrationSettings.map((setting, index) => (
                <store.IntegrationCard
                  key={`${setting.id}`}
                  result={integrationSettingsStore.settingToResult(setting)}
                  index={index + store.generalSettings.length}
                  setting={setting}
                  isActive
                />
              ))}
            </Masonry>
            <Views.VertSpace />
          </>
        )}
        <Views.SubTitle>Add Integration</Views.SubTitle>
        <Masonry>
          {integrationSettingsStore.allIntegrations
            // sort by not used first
            .sort((a, b) => (!isActive(a) && isActive(b) ? -1 : 1))
            .map((item, index) => {
              // custom auth clicks
              const onClick = ({ currentTarget }) => {
                if (item.auth) {
                  App.actions.toggleSelectItem(
                    { id: item.id, type: 'view', title: item.title },
                    currentTarget,
                  )
                } else {
                  App.actions.open(`${API_URL}/auth/${item.id}`)
                }
              }
              return (
                <store.IntegrationCard
                  key={`${item.id}`}
                  result={item}
                  index={index + store.allResults.length}
                  onClick={onClick}
                  disableShadow
                  cardProps={{
                    chromeless: true,
                    border: [1, 'transparent'],
                    background: 'transparent',
                    padding: [12, 12, 12, 10],
                  }}
                  iconProps={{
                    size: 18,
                  }}
                  titleProps={{
                    size: 1.1,
                  }}
                />
              )
            })}
        </Masonry>
      </SubPane>
    )
  }
}
