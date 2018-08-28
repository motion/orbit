import { ensure, react, view } from '@mcro/black'
import { query } from '@mcro/mediator'
import { Setting, SettingModel } from '@mcro/models'
import { App } from '@mcro/stores'
import { Button } from '@mcro/ui'
import * as React from 'react'
import { fuzzy } from '../../../helpers'
import { addIntegrationClickHandler } from '../../../helpers/addIntegrationClickHandler'
import { settingsList } from '../../../helpers/settingsList'
import { settingToResult } from '../../../helpers/settingToResult'
import { Mediator } from '../../../repositories'
import { modelQueryReaction } from '../../../repositories/modelQueryReaction'
import { IntegrationSettingsStore } from '../../../stores/IntegrationSettingsStore'
import { SelectionStore } from '../../../stores/SelectionStore'
import * as Views from '../../../views'
import { Grid } from '../../../views/Grid'
import { SimpleItem } from '../../../views/SimpleItem'
import { PaneManagerStore } from '../PaneManagerStore'
import { SubPane } from '../SubPane'
import { OrbitSettingCard } from './OrbitSettings/OrbitSettingCard'

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

  get isActive() {
    return this.props.paneManagerStore.activePane === this.props.name
  }

  setSelectionHandler = react(
    () => [this.isActive, this.results],
    ([isActive]) => {
      ensure('is active', isActive)
      this.props.selectionStore.setResults([
        { type: 'column', items: this.results },
      ])
    },
  )

  private get rawInactiveApps() {
    // sort by not used first
    return settingsList.sort(
      (a, b) => (!this.isAppActive(a) && this.isAppActive(b) ? -1 : 1),
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

  get results() {
    return fuzzy(App.state.query, this.rawActiveApps, {
      key: 'title',
    })
  }

  IntegrationCard = props => (
    <OrbitSettingCard
      pane="docked"
      subPane="apps"
      total={this.integrationSettings.length}
      inGrid
      borderRadius={4}
      {...props}
    />
  )

  getSettings = () => {
    return Mediator.loadMany(query(SettingModel, {
      where: {
        id: 1
      },
    }, {
      id: true,
      // title: true
    })).then(settings => {
      // console.log("SETTINGS LOADED", settings)
      return settings
    })
  }

  // this will go away soon...
  refreshSettings = modelQueryReaction(
    this.getSettings,
    val => {
      ensure('is active', this.isActive || !this.integrationSettings.length)
      this.updateIntegrationSettings(val)
    },
    {
      ignoreKeys: ['updatedAt', 'values'],
    },
  )

  updateIntegrationSettings = async (settings?) => {
    const next = settings || (await this.getSettings())
    this.integrationSettings = next
  }

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
        {!!store.results.length && (
          <>
            <Grid
              gridTemplateColumns="repeat(auto-fill, minmax(120px, 1fr))"
              gridAutoRows={80}
              margin={[5, -4]}
            >
              {store.results.map((result, index) => (
                <store.IntegrationCard
                  key={result.id}
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
