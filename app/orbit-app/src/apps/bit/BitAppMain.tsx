import * as React from 'react'
import { AppProps } from '../AppProps'
import { loadOne } from '@mcro/model-bridge'
import { BitModel } from '@mcro/models'
import { useStore } from '@mcro/use-store'
import { BitDecoration } from '../search/mainViews/BitDecoration'
import { AppSearchable } from '../../sources/views/apps/AppSearchable'
import { normalizeItem } from '../../helpers/normalizeItem'
import { BitTitleBar } from '../../sources/views/layout/BitTitleBar'
import { react } from '@mcro/black'
import { observer } from 'mobx-react-lite'

class BitAppStore {
  props: AppProps<'bit'>

  get appConfig() {
    return this.props.appStore.appConfig
  }

  model = react(
    () => this.appConfig,
    ({ id }) =>
      loadOne(BitModel, {
        args: {
          where: { id },
        },
      }),
  )
}

export const BitAppMain = observer((props: AppProps<'bit'>) => {
  const { model } = useStore(BitAppStore, props)
  if (!model) {
    return null
  }
  const View = props.sourcesStore.getView(model.integration, 'main')
  const normalizedItem = normalizeItem(model)
  return (
    <BitDecoration>
      <AppSearchable appStore={props.appStore}>
        {({ searchBar }) => (
          <>
            <BitTitleBar normalizedItem={normalizedItem} searchBar={searchBar} />
            <View bit={model} model={model} normalizedItem={normalizedItem} {...props} />
          </>
        )}
      </AppSearchable>
    </BitDecoration>
  )
})
