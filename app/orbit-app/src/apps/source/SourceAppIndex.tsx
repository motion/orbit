import * as React from 'react'
import { AppProps } from '../AppProps'
import { OrbitAppCard } from '../../components/OrbitAppCard'
import { Grid } from '../../views/Grid'
import { VerticalSpace } from '../../views'
import { SubTitle } from '../../views/SubTitle'
import { Unpad } from '../../views/Unpad'
import { SimpleItem } from '../../views/SimpleItem'
import { addAppClickHandler } from '../../helpers/addAppClickHandler'
import { Button } from '@mcro/ui'

export const SourceAppIndex = React.memo((props: AppProps) => {
  const { sourcesStore, isActive } = props
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
                  activeCondition={() => isActive}
                  app={app}
                />
              )
            })}
          </Grid>
          <VerticalSpace />
        </>
      )}
      <SubTitle>Add app</SubTitle>
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
})
