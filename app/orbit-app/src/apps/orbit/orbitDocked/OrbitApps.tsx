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

type Props = {
  name: string
  store?: OrbitAppsStore
  searchStore?: SearchStore
  paneManagerStore?: PaneManagerStore
  integrationSettingsStore?: IntegrationSettingsStore
}

class OrbitAppsStore {
  props: Props
  integrationSettings = []

  setGetResults = react(
    () => [this.isPaneActive, this.integrationSettings],
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
    return this.props.paneManagerStore.activePane === this.props.name
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
    const { name, store, integrationSettingsStore } = this.props
    return (
      <SubPane name={name} fadeBottom>
        <Views.Title>Apps</Views.Title>
        {!!store.integrationSettings.length && (
          <>
            <Grid
              gridTemplateColumns="repeat(auto-fill, minmax(120px, 1fr))"
              gridAutoRows={80}
            >
              {store.integrationSettings.map((setting, index) => (
                <store.IntegrationCard
                  key={`${setting.id}`}
                  result={integrationSettingsStore.settingToResult(setting)}
                  index={index}
                  setting={setting}
                  isActive
                />
              ))}
            </Grid>
            <Views.VertSpace />
          </>
        )}
        <Views.SubTitle>Add App</Views.SubTitle>
        <Unpad>
          {integrationSettingsStore.allIntegrations
            // sort by not used first
            .sort((a, b) => (!store.isActive(a) && store.isActive(b) ? -1 : 1))
            .map(item => {
              return (
                <SimpleItem
                  key={`${item.id}`}
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
