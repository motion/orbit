import * as React from 'react'
import { view, react } from '@mcro/black'
import { SettingRepository } from '../../../repositories'
import { OrbitSettingCard } from './OrbitSettings/OrbitSettingCard'
import { SubPane } from '../SubPane'
import * as Views from '../../../views'
import { PaneManagerStore } from '../PaneManagerStore'
import { IntegrationSettingsStore } from '../../../stores/IntegrationSettingsStore'
import { SearchStore } from '../../../stores/SearchStore'
import { modelQueryReaction } from '../../../repositories/modelQueryReaction'
import { addIntegrationClickHandler } from '../../../helpers/addIntegrationClickHandler'
import { generalSettingQuery } from '../../../repositories/settingQueries'
import { Grid } from '../../../views/Grid'
import { SimpleItem } from '../../../views/SimpleItem'
import { Button } from '@mcro/ui'
import { fuzzy } from '../../../helpers'
import { App } from '@mcro/stores'
import { Setting } from '@mcro/models'
import { settingToResult } from '../../../helpers/settingToResult'
import { settingsList } from '../../../helpers/settingsList'

type Props = {
  name: string
  store?: OrbitAppsStore
  searchStore?: SearchStore
  paneManagerStore?: PaneManagerStore
  integrationSettingsStore?: IntegrationSettingsStore
}

class OrbitAppsStore {
  props: Props
  integrationSettings: Setting[] = []

  get isPaneActive() {
    return this.props.paneManagerStore.activePane === this.props.name
  }

  private get rawInactiveApps() {
    // sort by not used first
    return settingsList.sort(
      (a, b) => (!this.isActive(a) && this.isActive(b) ? -1 : 1),
    )
  }

  get inactiveApps() {
    return fuzzy(App.state.query, this.rawInactiveApps, {
      key: 'title',
    })
  }

  private get rawActiveApps() {
    return this.integrationSettings.map(setting => ({
      ...settingToResult(setting),
      setting,
    }))
  }

  get activeApps() {
    return fuzzy(App.state.query, this.rawActiveApps, {
      key: 'title',
    })
  }

  _generalSettingUpdate = Date.now()
  _generalSetting = modelQueryReaction(generalSettingQuery)

  get generalSetting() {
    this._generalSettingUpdate
    return this._generalSetting
  }

  IntegrationCard = props => (
    <OrbitSettingCard
      pane="docked"
      subPane="apps"
      total={this.integrationSettings.length}
      inGrid
      titleProps={{
        size: 1,
      }}
      {...props}
    />
  )

  getSettings = () =>
    SettingRepository.find({
      where: {
        category: 'integration',
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

const Unpad = view({
  margin: [0, -16],
})

@view.attach('searchStore', 'paneManagerStore', 'integrationSettingsStore')
@view.attach({
  store: OrbitAppsStore,
})
@view
export class OrbitApps extends React.Component<Props> {
  render() {
    const { name, store } = this.props
    return (
      <SubPane name={name} fadeBottom>
        <Views.Title>Apps</Views.Title>
        {!!store.activeApps.length && (
          <>
            <Grid
              gridTemplateColumns="repeat(auto-fill, minmax(120px, 1fr))"
              gridAutoRows={80}
            >
              {store.activeApps.map((result, index) => (
                <store.IntegrationCard
                  key={result.id}
                  result={result}
                  index={index}
                  setting={result.setting}
                  isActive
                />
              ))}
            </Grid>
            <Views.VertSpace />
          </>
        )}
        <Views.SubTitle>Add App</Views.SubTitle>
        <Unpad>
          {store.inactiveApps.map(item => {
            return (
              <SimpleItem
                key={item.id}
                onClick={addIntegrationClickHandler(item)}
                title={item.title}
                icon={item.icon}
                after={<Button>Add</Button>}
              />
            )
          })}
        </Unpad>
      </SubPane>
    )
  }
}
