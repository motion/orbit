import * as React from 'react'
import { AppProps } from '../AppProps'
import { loadOne } from '@mcro/model-bridge'
import { PersonBitModel, BitModel } from '@mcro/models'
import { useStore } from '@mcro/use-store'
import { AppConfig } from '@mcro/stores'
import { react } from '@mcro/black'
import { normalizeItem } from '../../helpers/normalizeItem'
import { AppSearchable } from '../../sources/views/apps/AppSearchable'
import { BitTitleBar } from '../../sources/views/layout/BitTitleBar'

class SearchAppStore {
  props: AppProps

  get appConfig() {
    return this.props.appStore.appConfig
  }

  model = react(() => this.appConfig, x => this.getModel(x))

  get isSingle() {
    return true
  }

  getModel = async ({ id, type }: AppConfig) => {
    let selectedItem = null
    if (type === 'person' || type === 'person-bit') {
      selectedItem = await loadOne(PersonBitModel, {
        args: {
          where: { id },
          relations: ['people'],
        },
      })
    } else if (type === 'bit') {
      selectedItem = await loadOne(BitModel, {
        args: {
          where: { id },
          relations: ['people'],
        },
      })
    }
    return selectedItem
  }
}

export function SearchAppMain(props: AppProps) {
  const store = useStore(SearchAppStore, props)

  // show a single item
  if (store.isSingle) {
    const { model } = store
    if (model) {
      if (model.target === 'person-bit') {
        const View = props.sourcesStore.getView('person', 'main')
        return <View model={model} {...props} />
      }
      if (model.target === 'bit') {
        const View = props.sourcesStore.getView(model.integration, 'main')
        const normalizedItem = normalizeItem(model)
        return (
          <AppSearchable>
            {({ searchBar }) => (
              <>
                <BitTitleBar normalizedItem={normalizedItem} searchBar={searchBar} />
                <View bit={model} model={model} normalizedItem={normalizedItem} {...props} />
              </>
            )}
          </AppSearchable>
        )
      }
    }
    return <div>not found single: model {JSON.stringify(model)}</div>
  }

  // show a search

  return <>hi {JSON.stringify(props)}</>
}
