import { view } from '@mcro/black'
import * as React from 'react'
import { OrbitAppCard } from '../views/OrbitAppCard'
import * as Views from '../../../../views'
import { PaneManagerStore } from '../../PaneManagerStore'
import { SelectionStore } from '../SelectionStore'
import { addIntegrationClickHandler } from '../../../../helpers/addIntegrationClickHandler'
import { Grid } from '../../../../views/Grid'
import { SimpleItem } from '../../../../views/SimpleItem'
import { Button } from '@mcro/ui'
import { Unpad } from '../../../../views/Unpad'
import { AppsStore } from '../../../../stores/AppsStore'

type Props = {
  paneManagerStore?: PaneManagerStore
  selectionStore?: SelectionStore
  appsStore: AppsStore
}

@view.attach('appsStore')
@view
export class OrbitSettingsApps extends React.Component<Props> {
  render() {
    const { appsStore } = this.props
    return (
      <>
        {!!appsStore.allApps.length && (
          <>
            <Grid
              gridTemplateColumns="repeat(auto-fill, minmax(120px, 1fr))"
              gridAutoRows={80}
              margin={[5, -4]}
            >
              {appsStore.activeApps.map((app, index) => (
                <OrbitAppCard
                  key={app.integration}
                  model={app}
                  pane="docked"
                  subPane="apps"
                  total={appsStore.activeApps.length}
                  inGrid
                  app={{
                    ...app.instanceConfig,
                    type: 'setting',
                    viewConfig: {
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
        <Views.SubTitle>Add app</Views.SubTitle>
        <Unpad>
          {appsStore.allApps.map(app => {
            return (
              <SimpleItem
                key={app.integration}
                onClick={addIntegrationClickHandler(app.instanceConfig)}
                title={app.integrationName}
                icon={app.display.icon}
                after={<Button size={0.9}>Add</Button>}
              />
            )
          })}
        </Unpad>
      </>
    )
  }
}
