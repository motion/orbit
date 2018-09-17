import { ensure, react, view } from '@mcro/black'
import { Setting, SettingModel } from '@mcro/models'
import * as React from 'react'
import { observeMany } from '../../../../repositories'
import { OrbitAppCard } from './OrbitAppCard'
import { SubPane } from '../../SubPane'
import * as Views from '../../../../views'
import { PaneManagerStore } from '../../PaneManagerStore'
import { SelectionStore } from '../SelectionStore'
import { addIntegrationClickHandler } from '../../../../helpers/addIntegrationClickHandler'
import { Grid } from '../../../../views/Grid'
import { SimpleItem } from '../../../../views/SimpleItem'
import { Button } from '@mcro/ui'
import { fuzzyQueryFilter } from '../../../../helpers'
import { App } from '@mcro/stores'
import { settingToAppConfig } from '../../../../helpers/toAppConfig/settingToAppConfig'
import { settingsList } from '../../../../helpers/settingsList'
import { NoResultsDialog } from '../views/NoResultsDialog'

type Props = {
  name: string
  store?: OrbitAppsStore
  paneManagerStore?: PaneManagerStore
  selectionStore?: SelectionStore
}

class OrbitAppsStore {
  props: Props
  integrations: Setting[] = []
  private integrations$ = observeMany(SettingModel, {
    args: {
      where: { category: 'integration' },
    },
  }).subscribe(settings => {
    this.integrations = settings
  })

  willUnmount() {
    this.integrations$.unsubscribe()
  }

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
      this.props.selectionStore.setResults([{ type: 'column', items: this.filteredActiveApps }])
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
      return a.id.localeCompare(b.id)
    })
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
  render() {
    const { name, store } = this.props
    const hasFilteredApps = !!store.filteredAvailableApps.length
    return (
      <SubPane name={name} fadeBottom>
        <Views.SmallVerticalSpace />
        <Views.Title>Apps</Views.Title>
        {!!store.filteredActiveApps.length && (
          <>
            <Grid
              gridTemplateColumns="repeat(auto-fill, minmax(120px, 1fr))"
              gridAutoRows={80}
              margin={[5, -4]}
            >
              {store.filteredActiveApps.map((result, index) => (
                <OrbitAppCard
                  key={result.id}
                  settingId={+result.id}
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
        {hasFilteredApps && (
          <>
            <Views.SubTitle>Add App</Views.SubTitle>
            <Unpad>
              {store.filteredAvailableApps.map(item => {
                return (
                  <SimpleItem
                    key={item.id}
                    onClick={addIntegrationClickHandler(item)}
                    title={item.title}
                    icon={item.icon}
                    after={<Button size={0.9}>Add</Button>}
                  />
                )
              })}
            </Unpad>
          </>
        )}
        {!hasFilteredApps && <NoResultsDialog />}
      </SubPane>
    )
  }
}
