import * as React from 'react'
import { AppProps } from '../AppProps'
import { loadOne } from '@mcro/model-bridge'
import { PersonBitModel, BitModel } from '@mcro/models'
import { useStore } from '@mcro/use-store'

class SearchAppStore {
  props: AppProps

  get appConfig() {
    return this.props.appStore.appConfig
  }

  get model() {
    return null
  }

  get isSingle() {
    return true
  }

  getModel = async () => {
    const { id, type } = this.appConfig
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
      if (model.type === 'person-bit') {
        const View = props.sourcesStore.getView('person', 'main')
        return <View model={model} {...props} />
      }
      if (model.type === 'bit') {
        const View = props.sourcesStore.getView(model.integration, 'main')
        return <View model={model} {...props} />
      }
    }
    return <div>not found single</div>
  }

  // show a search

  return <>hi {JSON.stringify(props)}</>
}
