import { view, attach } from '@mcro/black'
import * as React from 'react'
import * as Views from '../../../../views'
import { addAppClickHandler } from '../../../../helpers/addAppClickHandler'
import { Grid } from '../../../../views/Grid'
import { SimpleItem } from '../../../../views/SimpleItem'
import { Button } from '@mcro/ui'
import { Unpad } from '../../../../views/Unpad'
import { SourcesStore } from '../../../../stores/SourcesStore'
import { OrbitAppCard } from '../../../../components/OrbitAppCard'
import { SettingsStore } from './OrbitSettings'

type Props = {
  sourcesStore?: SourcesStore
  settingsStore?: SettingsStore
}

@attach('sourcesStore')
@view
export class OrbitSettingsApps extends React.Component<Props> {
  isSubPaneSelected = () => this.props.settingsStore.subPane === 'apps'

  render() {
    const { sourcesStore } = this.props
    return (
      <>
        {!!sourcesStore.activeSources.length && (
          <>
            <Grid
              gridTemplateColumns="repeat(auto-fill, minmax(120px, 1fr))"
              gridAutoRows={80}
              margin={[5, -4]}
            >
              {sourcesStore.activeSources.map((app, index) => {
                return (
                  <OrbitAppCard
                    key={app.source.id}
                    index={index}
                    total={sourcesStore.activeSources.length}
                    activeCondition={this.isSubPaneSelected}
                    app={app}
                  />
                )
              })}
            </Grid>
            <Views.VerticalSpace />
          </>
        )}
        <Views.SubTitle>Add app</Views.SubTitle>
        <Unpad>
          {sourcesStore.allSources.map((app, index) => {
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
