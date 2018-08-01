import * as React from 'react'
import { view, react } from '@mcro/black'
import { OrbitSettingCard } from './OrbitSettingCard'
import { SubPane } from './SubPane'
import * as Views from '../../views'
import { Setting, Not, IsNull, findOrCreate } from '@mcro/models'
import { modelQueryReaction } from '@mcro/helpers'
import { Masonry } from '../../views/Masonry'
import { App } from '@mcro/stores'
import * as UI from '@mcro/ui'
import { AppStore } from '../../stores/AppStore'
import { PaneManagerStore } from './PaneManagerStore'
import { IntegrationSettingsStore } from '../../stores/IntegrationSettingsStore'
import { SearchStore } from '../../stores/SearchStore'

type Props = {
  name: string
  store?: OrbitSettingsStore
  searchStore?: SearchStore
  appStore?: AppStore
  paneStore?: PaneManagerStore
  integrationSettingsStore?: IntegrationSettingsStore
}

class OrbitSettingsStore {
  props: Props

  hasFetchedOnce = false

  setGetResults = react(
    () => [this.isPaneActive, this.integrationSettings],
    async ([isActive, integrationSettings], { sleep }) => {
      if (!isActive) {
        throw react.cancel
      }
      await sleep(40)
      const getResults = () => integrationSettings
      // @ts-ignore
      getResults.shouldFilter = true
      this.props.searchStore.setGetResults(() => this.allResults)
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
        where: { category: 'integration', token: Not(IsNull()) },
      }),
    {
      condition: () => {
        return this.isPaneActive || this.integrationSettings.length === 0
      },
      defaultValue: [],
      log: true,
    },
  )
}

@view.attach('appStore', 'searchStore', 'paneStore', 'integrationSettingsStore')
@view.attach({
  store: OrbitSettingsStore,
})
@view
export class OrbitSettings extends React.Component<Props> {
  render() {
    const { name, store, appStore, integrationSettingsStore } = this.props
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
              appStore={appStore}
              subtitle={result.subtitle}
              isActive
            />
          ))}
        </Masonry>
        <Views.VertSpace />
        <UI.View if={store.integrationSettings.length}>
          <Views.SubTitle>Active Integrations</Views.SubTitle>
          <Masonry>
            {store.integrationSettings
              .map((setting, index) => (
                <store.IntegrationCard
                  key={`${setting.id}`}
                  result={integrationSettingsStore.settingToResult(setting)}
                  index={index + store.generalSettings.length}
                  appStore={appStore}
                  setting={setting}
                  isActive
                />
              ))
              .filter(Boolean)}
          </Masonry>
          <Views.VertSpace />
        </UI.View>
        <Views.SubTitle>Add Integration</Views.SubTitle>
        <Masonry>
          {integrationSettingsStore.allIntegrations
            // sort by not used first
            .sort((a, b) => (!isActive(a) && isActive(b) ? -1 : 1))
            .map((item, index) => {
              // custom auth clicks
              const onClick = item.auth
                ? ({ currentTarget }) => {
                    console.log('select auth')
                    App.actions.toggleSelectItem(
                      { id: item.id, type: 'view', title: item.title },
                      currentTarget,
                    )
                  }
                : null
              return (
                <store.IntegrationCard
                  key={`${item.id}`}
                  result={item}
                  index={index + store.allResults.length}
                  appStore={appStore}
                  onClick={onClick}
                  disableShadow
                  cardProps={{
                    chromeless: true,
                    border: [1, 'transparent'],
                    background: 'transparent',
                    padding: [12, 12, 12, 10],
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
