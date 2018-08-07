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
import { modelQueryReaction } from '../../../../repositories/modelQueryReaction'
import { addIntegrationClickHandler } from '../../../../helpers/addIntegrationClickHandler'
import { generalSettingQuery } from '../../../../repositories/settingQueries'

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

  generalSetting = modelQueryReaction(generalSettingQuery)

  get allResults() {
    return [...this.integrationSettings]
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

  generalChange = prop => val => {
    console.log('handleChange', prop, val)
    this.props.setting.values[prop] = val
    // this.props.setting.save()
    SettingRepository.save(this.props.setting)
  }
}

const Section = view({
  padding: [10, 0],
})

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
        {!!store.generalSetting && (
          <Section>
            <Views.CheckBoxRow
              checked={store.generalSetting.values.autoLaunch}
              onChange={store.generalChange('autoLaunch')}
            >
              Start on Login
            </Views.CheckBoxRow>
            <Views.InputRow
              label="Open shortcut"
              value={store.generalSetting.values.openShortcut}
              onChange={store.generalChange('openShortcut')}
            />
          </Section>
        )}
        {!!store.integrationSettings.length && (
          <>
            <Views.SubTitle>Active Integrations</Views.SubTitle>
            <Masonry>
              {store.integrationSettings.map((setting, index) => (
                <store.IntegrationCard
                  key={`${setting.id}`}
                  result={integrationSettingsStore.settingToResult(setting)}
                  index={index}
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
              return (
                <store.IntegrationCard
                  key={`${item.id}`}
                  result={item}
                  index={index + store.allResults.length}
                  onClick={addIntegrationClickHandler(item)}
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
