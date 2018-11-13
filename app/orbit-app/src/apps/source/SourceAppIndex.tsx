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
import { react, always } from '@mcro/black'
import { useStore } from '@mcro/use-store'
import { memo } from '../../helpers/memo'

class SourceIndexStore {
  props: AppProps

  get results() {
    return this.props.sourcesStore.activeSources
  }

  setSelectionResults = react(
    () => always(this.results),
    () => {
      this.props.appStore.setResults([
        { type: 'column', indices: this.results.map((_, index) => index) },
      ])
    },
  )
}

export const SourceAppIndex = memo((props: AppProps) => {
  const { sourcesStore, isActive } = props
  const store = useStore(SourceIndexStore, props)
  return (
    <>
      {!!store.results.length && (
        <>
          <Grid
            gridTemplateColumns="repeat(auto-fill, minmax(120px, 1fr))"
            gridAutoRows={80}
            margin={[5, -4]}
          >
            {store.results.map((app, index) => {
              return (
                <OrbitAppCard
                  key={app.source.id}
                  index={index}
                  total={store.results.length}
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
