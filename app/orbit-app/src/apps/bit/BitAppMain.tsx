import * as React from 'react'
import { AppProps } from '../AppProps'
import { BitModel, AppType } from '@mcro/models'
import { BitDecoration } from '../search/mainViews/BitDecoration'
import { AppSearchable } from '../../sources/views/apps/AppSearchable'
import { normalizeItem } from '../../helpers/normalizeItem'
import { BitTitleBar } from '../../sources/views/layout/BitTitleBar'
import { useModel } from '@mcro/model-bridge'

export default function BitAppMain(props: AppProps<AppType.bit>) {
  const [bit] = useModel(BitModel, { where: { id: +props.appConfig.id } })
  // console.log('hello bit', bit)
  if (!bit) {
    return null
  }
  const View = props.sourcesStore.getView(bit.integration, 'main')
  const normalizedItem = normalizeItem(bit)
  return (
    <BitDecoration>
      <AppSearchable appStore={props.appStore}>
        {({ searchBar }) => (
          <>
            <BitTitleBar normalizedItem={normalizedItem} searchBar={searchBar} />
            <View item={bit} normalizedItem={normalizedItem} {...props} />
          </>
        )}
      </AppSearchable>
    </BitDecoration>
  )
}
