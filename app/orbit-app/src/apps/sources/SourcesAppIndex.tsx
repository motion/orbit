import * as React from 'react'
import { AppProps } from '../AppProps'
import { Grid } from '../../views/Grid'
import { VerticalSpace } from '../../views'
import { SubTitle } from '../../views/SubTitle'
import { Unpad } from '../../views/Unpad'
import { SimpleItem } from '../../views/SimpleItem'
import { addSourceClickHandler } from '../../helpers/addSourceClickHandler'
import { Button } from '@mcro/ui'
import { react, always } from '@mcro/black'
import { useStore } from '@mcro/use-store'
import { observer } from 'mobx-react-lite'
import { OrbitAppItem } from '../../components/OrbitAppItem'

class SourcesIndex {
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

export const SourcesAppIndex = observer((props: AppProps) => {
  const { sourcesStore, isActive } = props
  const store = useStore(SourcesIndex, props)
  return (
    <>
      {!!store.results.length && (
        <>
          {store.results.map((app, index) => {
            return (
              <OrbitAppItem
                key={app.source.id}
                index={index}
                total={store.results.length}
                // TODO
                activeCondition={isActive}
                app={app}
              />
            )
          })}
          <VerticalSpace />
        </>
      )}
      <SubTitle>Add app</SubTitle>
      {sourcesStore.allSources.map((app, index) => {
        return (
          <SimpleItem
            key={`${index}${app.integration}`}
            onClick={addSourceClickHandler(app)}
            title={app.appName}
            icon={app.integration}
            after={<Button size={0.9}>Add</Button>}
          />
        )
      })}
    </>
  )
})
