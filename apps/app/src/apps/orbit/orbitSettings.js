import * as React from 'react'
import { view, react } from '@mcro/black'
import { OrbitSettingCard } from './orbitSettingCard'
// import { OrbitGeneralSettings } from './orbitSettings/orbitGeneralSettings'
import { OrbitDockedPane } from './orbitDockedPane'
import * as Views from '~/views'
import { Setting, Not, IsNull } from '@mcro/models'
import {
  settingToResult,
  allIntegrations,
} from './orbitSettings/orbitSettingsIntegrations'
import { modelQueryReaction } from '@mcro/helpers'
import * as GeneralSettings from './orbitSettings/general'
import { Masonry } from '~/views/masonry'
import { App } from '@mcro/stores'

const generalSettings = [
  {
    id: 'general-account',
    type: 'setting',
    integration: 'general-account',
    title: 'Account',
    icon: 'users_single',
    auth: GeneralSettings.OrbitSettingAccount,
  },
  {
    id: 'general-general',
    type: 'setting',
    integration: 'general-general',
    title: 'General',
    icon: 'gear',
    auth: GeneralSettings.OrbitSettingGeneral,
  },
  // {
  //   id: 'general-sync',
  //   type: 'setting',
  //   integration: 'general-sync',
  //   title: 'Sync',
  //   icon: 'sync',
  //   auth: GeneralSettings.OrbitSettingSync,
  // },
]

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
      this.props.appStore.setGetResults(() => this.allResults)
    },
    { immediate: true },
  )

  get allResults() {
    return [...generalSettings, ...this.integrationSettings]
  }

  IntegrationCard = props => (
    <OrbitSettingCard
      pane="summary"
      subPane="settings"
      hoverToSelect
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
      condition: () => this.isPaneActive,
      defaultValue: [],
    },
  )
}

@view.attach('appStore', 'paneStore')
@view({
  Store: OrbitSettingsStore,
})
export class OrbitSettings extends React.Component {
  render({ name, Store, appStore }) {
    const { integrationSettings } = Store
    const isActive = result => {
      return !!integrationSettings.find(setting => setting.type === result.id)
    }
    return (
      <OrbitDockedPane name={name} fadeBottom>
        <Views.SubTitle>Settings</Views.SubTitle>
        <Masonry>
          {generalSettings.map((result, index) => (
            <Store.IntegrationCard
              key={`${result.id}`}
              result={result}
              index={index}
              appStore={appStore}
              isActive
            />
          ))}
        </Masonry>
        {/* <OrbitGeneralSettings settingsStore={store} /> */}
        <Views.VertSpace />
        <section if={integrationSettings.length}>
          <Views.SubTitle>Active Integrations</Views.SubTitle>
          <Masonry>
            {integrationSettings.map((setting, index) => (
              <Store.IntegrationCard
                key={`${setting.id}`}
                result={settingToResult(setting)}
                index={index + generalSettings.length}
                appStore={appStore}
                setting={setting}
                isActive
              />
            ))}
          </Masonry>
          <Views.VertSpace />
        </section>
        <Views.SubTitle>Add Integration</Views.SubTitle>
        <Masonry>
          {allIntegrations
            .sort((a, b) => (!isActive(a) && isActive(b) ? -1 : 1))
            .map((item, index) => (
              <Store.IntegrationCard
                key={`${item.id}`}
                result={item}
                index={index + Store.allResults.length}
                appStore={appStore}
                hoverable
                onSelect={
                  item.auth &&
                  (target => {
                    App.actions.selectItem(
                      { id: item.id, type: 'view', title: item.title },
                      target,
                    )
                  })
                }
              />
            ))}
        </Masonry>
      </OrbitDockedPane>
    )
  }

  static style = {
    cards: {
      userSelect: 'none',
      marginBottom: 10,
    },
    inactive: {
      opacity: 0.7,
      transition: 'all ease-in 300ms',
      '&:hover': {
        opacity: 1,
      },
    },
  }
}
