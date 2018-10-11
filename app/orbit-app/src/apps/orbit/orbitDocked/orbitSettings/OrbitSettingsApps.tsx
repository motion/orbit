import { view } from '@mcro/black'
import { Setting, SettingModel } from '@mcro/models'
import * as React from 'react'
import { observeMany } from '@mcro/model-bridge'
import { OrbitAppCard } from '../views/OrbitAppCard'
import * as Views from '../../../../views'
import { PaneManagerStore } from '../../PaneManagerStore'
import { SelectionStore } from '../SelectionStore'
import { addIntegrationClickHandler } from '../../../../helpers/addIntegrationClickHandler'
import { Grid } from '../../../../views/Grid'
import { SimpleItem } from '../../../../views/SimpleItem'
import { Button } from '@mcro/ui'
import { fuzzyQueryFilter } from '../../../../helpers'
import { settingsList } from '../../../../helpers/settingsList'
import { settingToAppConfig } from '../../../../helpers/toAppConfig/settingToAppConfig'
import { Unpad } from '../../../../views/Unpad'

type Props = {
  store?: OrbitAppsStore
  paneManagerStore?: PaneManagerStore
  selectionStore?: SelectionStore
}

class OrbitAppsStore {
  props: Props
  integrations: Setting[] = []
  activeQuery = ''
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

  get filteredAvailableApps() {
    return fuzzyQueryFilter(this.activeQuery, this.allAvailableApps, {
      key: 'title',
    })
  }

  get filteredActiveApps() {
    return fuzzyQueryFilter(this.activeQuery, this.integrations, {
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

@view.attach('selectionStore', 'paneManagerStore')
@view.attach({
  store: OrbitAppsStore,
})
@view
export class OrbitSettingsApps extends React.Component<Props> {
  render() {
    const { store } = this.props
    return (
      <>
        {!!store.filteredActiveApps.length && (
          <>
            <Grid
              gridTemplateColumns="repeat(auto-fill, minmax(120px, 1fr))"
              gridAutoRows={80}
              margin={[5, -4]}
            >
              {store.filteredActiveApps.map((setting, index) => (
                <OrbitAppCard
                  key={setting.id}
                  model={setting}
                  pane="docked"
                  subPane="apps"
                  total={store.integrations.length}
                  inGrid
                  result={{
                    ...settingToAppConfig(setting),
                    config: {
                      dimensions: [620, 620],
                      initialState: {
                        active: 'settings',
                      },
                    },
                  }}
                  index={index}
                  isActive
                />
              ))}
            </Grid>
            <Views.VerticalSpace />
          </>
        )}
        <Views.SubTitle>App Store</Views.SubTitle>
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
    )
  }
}
