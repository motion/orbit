import * as React from 'react'
import { view, react, ensure } from '@mcro/black'
import { SettingRepository } from '../../../repositories'
import { OrbitSettingCard } from './OrbitSettings/OrbitSettingCard'
import { SubPane } from '../SubPane'
import * as Views from '../../../views'
import { PaneManagerStore } from '../PaneManagerStore'
import { IntegrationSettingsStore } from '../../../stores/IntegrationSettingsStore'
import { SelectionStore } from '../../../stores/SelectionStore'
import { modelQueryReaction } from '../../../repositories/modelQueryReaction'
import { addIntegrationClickHandler } from '../../../helpers/addIntegrationClickHandler'
import { Grid } from '../../../views/Grid'
import { SimpleItem } from '../../../views/SimpleItem'
import { Button } from '@mcro/ui'
import { fuzzyQueryFilter } from '../../../helpers'
import { App } from '@mcro/stores'
import { Setting } from '@mcro/models'
import { settingToAppConfig } from '../../../helpers/settingToResult'
import { settingsList } from '../../../helpers/settingsList'

type Props = {
  name: string
  store?: OrbitAppsStore
  paneManagerStore?: PaneManagerStore
  integrationSettingsStore?: IntegrationSettingsStore
  selectionStore?: SelectionStore
}

class OrbitAppsStore {
  props: Props
  integrationSettings: Setting[] = []

  // when pane is active
  get isActive() {
    return this.props.paneManagerStore.activePane === this.props.name
  }

  // this is the searchbar value, active only when this pane is active
  private activeQuery = react(
    () => [this.isActive, App.state.query],
    ([isActive, query]) => {
      ensure('active', isActive)
      return query
    },
  )

  // this updates SelectionStore to handle keyboard movements
  setSelectionHandler = react(
    () => [this.isActive, this.filteredActiveApps],
    ([isActive]) => {
      ensure('is active', isActive)
      this.props.selectionStore.setResults([
        { type: 'column', items: this.filteredActiveApps },
      ])
    },
  )

  private get allAvailableApps() {
    // sort by not used first
    return settingsList.sort(
      (a, b) => (!this.isAppActive(a) && this.isAppActive(b) ? -1 : 1),
    )
  }

  get filteredAvailableApps() {
    return fuzzyQueryFilter(this.activeQuery, this.allAvailableApps, {
      key: 'title',
    })
  }

  private get allActiveApps() {
    return this.integrationSettings.map(setting => ({
      ...settingToAppConfig(setting),
      setting,
    }))
  }

  get filteredActiveApps() {
    return fuzzyQueryFilter(this.activeQuery, this.allActiveApps, {
      key: 'title',
    })
  }

  getSettings = () =>
    SettingRepository.find({
      where: {
        category: 'integration',
      },
    })

  // this will go away soon...
  refreshSettings = modelQueryReaction(
    this.getSettings,
    settings => {
      ensure('is active', this.isActive || !this.integrationSettings.length)
      this.integrationSettings = settings
    },
    {
      ignoreKeys: ['updatedAt', 'values'],
    },
  )

  isAppActive = result => {
    return !!this.integrationSettings.find(
      setting => setting.type === result.id,
    )
  }
}

const Unpad = view({
  margin: [0, -16],
})

@view.attach('selectionStore', 'paneManagerStore', 'integrationSettingsStore')
@view.attach({
  store: OrbitAppsStore,
})
@view
export class OrbitApps extends React.Component<Props> {
  render() {
    const { name, store } = this.props
    return (
      <SubPane name={name} fadeBottom>
        <Views.VerticalSpace />
        <Views.Title>My Apps</Views.Title>
        {!!store.filteredActiveApps.length && (
          <>
            <Grid
              gridTemplateColumns="repeat(auto-fill, minmax(120px, 1fr))"
              gridAutoRows={80}
              margin={[5, -4]}
            >
              {store.filteredActiveApps.map((result, index) => (
                <OrbitSettingCard
                  key={result.id}
                  pane="docked"
                  subPane="apps"
                  total={store.integrationSettings.length}
                  inGrid
                  borderRadius={4}
                  result={result}
                  index={index}
                  isActive
                />
              ))}
            </Grid>
            <Views.VertSpace />
          </>
        )}
        <Views.SubTitle>Add App</Views.SubTitle>
        <Unpad>
          {store.filteredAvailableApps.map(item => {
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
