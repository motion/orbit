import * as React from 'react'
import { view, react } from '@mcro/black'
import { OrbitSettingCard } from './orbitSettingCard'
import { OrbitDockedPane } from './orbitDockedPane'
import * as Views from '../../views'
import { Setting, Not, IsNull, findOrCreate } from '@mcro/models'
import {
  settingToResult,
  allIntegrations,
} from './orbitSettings/orbitSettingsIntegrations'
import { modelQueryReaction } from '@mcro/helpers'
import { Masonry } from '../../views/Masonry'
import { App } from '@mcro/stores'

class OrbitSettingsStore {
  get isPaneActive() {
    return this.props.paneStore.activePane === this.props.name
  }

  generalSettings = react(
    async () => {
      console.log('ensuring models are in place all over, remove me plz')
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
    return [...this.generalSettings, ...this.integrationSettings]
  }

  IntegrationCard = props => (
    <OrbitSettingCard
      pane="summary"
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
    const isActive = result => {
      return !!Store.integrationSettings.find(
        setting => setting.type === result.id,
      )
    }
    return (
      <OrbitDockedPane name={name} fadeBottom>
        <Views.SubTitle>Settings</Views.SubTitle>
        <Masonry>
          {Store.generalSettings.map((result, index) => (
            <Store.IntegrationCard
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
        <section if={Store.integrationSettings.length}>
          <Views.SubTitle>Active Integrations</Views.SubTitle>
          <Masonry>
            {Store.integrationSettings.map((setting, index) => (
              <Store.IntegrationCard
                key={`${setting.id}`}
                result={settingToResult(setting)}
                index={index + Store.generalSettings.length}
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
