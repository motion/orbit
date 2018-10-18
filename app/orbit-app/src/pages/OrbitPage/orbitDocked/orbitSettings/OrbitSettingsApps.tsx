import { view } from '@mcro/black'
import * as React from 'react'
import { OrbitAppCard } from '../views/OrbitAppCard'
import * as Views from '../../../../views'
import { addIntegrationClickHandler } from '../../../../helpers/addIntegrationClickHandler'
import { Grid } from '../../../../views/Grid'
import { SimpleItem } from '../../../../views/SimpleItem'
import { Button } from '@mcro/ui'
import { Unpad } from '../../../../views/Unpad'
import { AppsStore } from '../../../../stores/AppsStore'
import { PaneManagerStore } from '../../PaneManagerStore'

type Props = {
  appsStore?: AppsStore
  paneManagerStore?: PaneManagerStore
}

@view.attach('appsStore', 'paneManagerStore')
@view
export class OrbitSettingsApps extends React.Component<Props> {
  isSubPaneSelected = () => this.props.paneManagerStore.subPane === 'apps'

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
              {appsStore.activeApps.map((app, index) => {
                const model = appsStore.appSettings[index]
                return (
                  <OrbitAppCard
                    key={model.id}
                    index={index}
                    isActive
                    app={app}
                    model={model}
                    activeCondition={this.isSubPaneSelected}
                    pane="docked"
                    subPane="apps"
                    total={appsStore.activeApps.length}
                    inGrid
                  />
                )
              })}
            </Grid>
            <Views.VerticalSpace />
          </>
        )}
        <Views.SubTitle>Add app</Views.SubTitle>
        <Unpad>
          {appsStore.allApps.map((app, index) => {
            return (
              <SimpleItem
                key={`${index}${app.integration}`}
                onClick={addIntegrationClickHandler(app.viewConfig)}
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
