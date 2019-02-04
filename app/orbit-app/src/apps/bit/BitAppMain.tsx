import { useModel } from '@mcro/model-bridge'
import { AppType, BitModel } from '@mcro/models'
import * as React from 'react'
import { ItemPropsProvider } from '../../contexts/ItemPropsProvider'
import { normalizeItem } from '../../helpers/normalizeItem'
import { AppSearchable } from '../../sources/views/apps/AppSearchable'
import { BitTitleBar } from '../../sources/views/layout/BitTitleBar'
import { AppProps } from '../AppProps'

const defaultItemProps = {
  itemProps: {
    padding: [1, 6],
    '&:hover': {
      background: [0, 0, 0, 0.02],
    },
  },
}

export default function BitAppMain(props: AppProps<AppType.bit>) {
  const [bit] = useModel(BitModel, { where: { id: +props.appConfig.id } })
  console.log('hello bit', bit)
  if (!bit) {
    return null
  }
  const View = props.sourcesStore.getView(bit.integration, 'main')
  const normalizedItem = normalizeItem(bit)
  return (
    <ItemPropsProvider value={defaultItemProps}>
      <AppSearchable appStore={props.appStore}>
        {({ searchBar }) => (
          <>
            <BitTitleBar normalizedItem={normalizedItem} searchBar={searchBar} />
            <View item={bit} normalizedItem={normalizedItem} {...props} />
          </>
        )}
      </AppSearchable>
    </ItemPropsProvider>
  )
}
