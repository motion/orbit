import { ensure, react, view } from '@mcro/black'
import {  Subscription } from '@mcro/mediator'
import { IntegrationType, Setting, SettingModel } from '@mcro/models'
import { App } from '@mcro/stores'
import { Button } from '@mcro/ui'
import * as React from 'react'
import { fuzzyQueryFilter } from '../../../helpers'
import { addIntegrationClickHandler } from '../../../helpers/addIntegrationClickHandler'
import { settingsList } from '../../../helpers/settingsList'
import { settingToAppConfig } from '../../../helpers/settingToResult'
import { Mediator } from '../../../repositories'
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
  selectionStore?: SelectionStore
}

class OrbitAppsStore {
  props: Props
  integrations: Setting[] = []

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

  get filteredAvailableApps() {
    return fuzzyQueryFilter(this.activeQuery, this.allAvailableApps, {
      key: 'title',
    })
  }

  private get allActiveApps() {
    return this.integrations.map(setting => ({
      ...settingToAppConfig(setting),
      setting,
    }))
  }

  get filteredActiveApps() {
    return fuzzyQueryFilter(this.activeQuery, this.allActiveApps, {
      key: 'title',
    })
  }

  private get allAvailableApps() {
    // sort by not used first
    return settingsList.sort((a, b) => {
      return (!this.hasIntegration(a.id) && this.hasIntegration(b.id) ? -1 : 1)
    })
  }

  private hasIntegration = (type: IntegrationType) => {
    return !!this.integrations.find(
      setting => setting.type === type,
    )
  }
}

const Unpad = view({
  margin: [0, -16],
})

@view.attach('selectionStore', 'paneManagerStore')
@view.attach({
  store: OrbitAppsStore,
})
@view
export class OrbitApps extends React.Component<Props> {

  subscription: Subscription;

  componentDidMount() {
    this.subscription = Mediator
      .observeMany(SettingModel, {
        args: {
          where: { category: 'integration' },
        }
      })
      .subscribe(settings => {
        console.log(`updated settings`, settings)
        this.props.store.integrations = settings
      })
  }

  componentWillUnmount() {
    this.subscription.unsubscribe();
  }

  render() {
    const { name, store } = this.props
    return (
      <SubPane name={name} fadeBottom>
        <Views.SmallVerticalSpace />
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
                  total={store.integrations.length}
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
