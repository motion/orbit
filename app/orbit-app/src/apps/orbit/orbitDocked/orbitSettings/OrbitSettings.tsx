import * as React from 'react'
import { view, react } from '@mcro/black'
import { SettingRepository } from '../../../../repositories'
import { OrbitSettingCard } from './OrbitSettingCard'
import { SubPane } from '../../SubPane'
import * as Views from '../../../../views'
import { Setting } from '@mcro/models'
import { Masonry } from '../../../../views/Masonry'
import { App } from '@mcro/stores'
import { PaneManagerStore } from '../../PaneManagerStore'
import { IntegrationSettingsStore } from '../../../../stores/IntegrationSettingsStore'
import { SearchStore } from '../../../../stores/SearchStore'
import { API_URL } from '../../../../constants'
import { modelQueryReaction } from '../../../../repositories/modelQueryReaction'

type Props = {
  name: string
  store?: OrbitSettingsStore
  searchStore?: SearchStore
  paneManagerStore?: PaneManagerStore
  integrationSettingsStore?: IntegrationSettingsStore
}

class OrbitSettingsStore {
  props: Props
  integrationSettings = []

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

  didMount() {
    const dispose = App.onMessage(App.messages.TOGGLE_SETTINGS, () =>
      this.updateIntegrationSettings(),
    )
    this.subscriptions.add({ dispose })
  }

  get isPaneActive() {
    return this.props.paneManagerStore.activePane === this.props.name
  }

  generalSettings = react(
    async () => {
      const settingQuery = [
        { type: 'general', category: 'general' },
        { type: 'account', category: 'general' },
      ]

      // don't like the fact that this is happening here. looks like backend should be the only place were this code should be
      const settings = await Promise.all(
        settingQuery.map(async settingQuery => {
          const setting = await SettingRepository.findOne({
            where: settingQuery,
          })
          if (setting) return setting

          return SettingRepository.save(settingQuery as Setting) // todo: make sure save really returns us
        }),
      )

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

  getSettings = () =>
    SettingRepository.find({
      where: {
        category: 'integration',
        // token: { $not: null },
        // type: { $not: 'setting' },
      },
    })

  // this will go away soon...
  refreshSettings = modelQueryReaction(this.getSettings, val => {
    // only when pane active
    if (!this.isPaneActive && this.integrationSettings.length) {
      throw react.cancel
    }
    this.updateIntegrationSettings(val)
  })

  updateIntegrationSettings = async (settings?) => {
    const next = settings || (await this.getSettings())
    this.integrationSettings = next
  }

  isActive = result => {
    return !!this.integrationSettings.find(
      setting => setting.type === result.id,
    )
  }
}

@view.attach('searchStore', 'paneManagerStore', 'integrationSettingsStore')
@view.attach({
  store: OrbitSettingsStore,
})
@view
export class OrbitSettings extends React.Component<Props> {
  render() {
    const { name, store, integrationSettingsStore } = this.props
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
                >
                  {/* <ClearButton position="absolute" bottom={8} right={8} /> */}
                </store.IntegrationCard>
              ))}
            </Masonry>
            <Views.VertSpace />
          </>
        )}
        <Views.SubTitle>Add Integration</Views.SubTitle>
        <Masonry>
          {integrationSettingsStore.allIntegrations
            // sort by not used first
            .sort((a, b) => (!store.isActive(a) && store.isActive(b) ? -1 : 1))
            .map((item, index) => {
              // custom auth clicks
              const onClick = ({ currentTarget }) => {
                if (item.auth) {
                  App.actions.toggleSelectItem(
                    { id: item.id, type: 'view', title: item.title },
                    currentTarget,
                  )
                } else {
                  App.actions.openAuth(item.id)
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
