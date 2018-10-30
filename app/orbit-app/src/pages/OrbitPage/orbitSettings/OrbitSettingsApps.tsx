import { view, attach } from '@mcro/black'
import * as React from 'react'
import * as Views from '../../../views'
import { addAppClickHandler } from '../../../helpers/addAppClickHandler'
import { Grid } from '../../../views/Grid'
import { SimpleItem } from '../../../views/SimpleItem'
import { Button } from '@mcro/ui'
import { Unpad } from '../../../views/Unpad'
import { AppsStore } from '../../../stores/AppsStore'
import { OrbitAppCard } from '../../../components/OrbitAppCard'
import { PaneManagerStore } from '../../../stores/PaneManagerStore'

type Props = {
  appsStore?: AppsStore
  paneManagerStore?: PaneManagerStore
}

@attach('appsStore', 'paneManagerStore')
@view
export class OrbitSettingsApps extends React.Component<Props> {
  isSubPaneSelected = () => this.props.paneManagerStore.subPane === 'apps'

  render() {
    const { appsStore } = this.props
    return (
      <>
        {!!appsStore.activeIntegrations.length && (
          <>
            <Grid
              gridTemplateColumns="repeat(auto-fill, minmax(120px, 1fr))"
              gridAutoRows={80}
              margin={[5, -4]}
            >
              {appsStore.activeIntegrations.map((app, index) => {
                return (
                  <OrbitAppCard
                    key={app.setting.id}
                    index={index}
                    total={appsStore.activeIntegrations.length}
                    activeCondition={this.isSubPaneSelected}
                    isActive
                    app={app}
                    pane="docked"
                    subPane="apps"
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
          {appsStore.allIntegrations.map((app, index) => {
            return (
              <SimpleItem
                key={`${index}${app.integration}`}
                onClick={addAppClickHandler(app)}
                title={app.appName}
                icon={app.integration}
                after={<Button size={0.9}>Add</Button>}
              />
            )
          })}
        </Unpad>
      </>
    )
  }
}
