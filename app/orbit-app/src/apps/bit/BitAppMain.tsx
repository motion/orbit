import { HighlightedSearchable, ItemPropsProvider, normalizeItem } from '@mcro/kit'
import { BitModel } from '@mcro/models'
import * as React from 'react'
import { useStores } from '../../hooks/useStores'
import { useModel } from '../../useModel'
import { AppProps } from '../AppTypes'
import { BitTitleBar } from './BitTitlebar'

const defaultItemProps = {
  itemProps: {
    padding: [1, 6],
    '&:hover': {
      background: [0, 0, 0, 0.02],
    },
  },
}

export default function BitAppMain(props: AppProps) {
  const { sourcesStore } = useStores()
  const [bit] = useModel(BitModel, {
    where: { id: +props.appConfig.id },
    relations: ['people'],
  })
  if (!bit) {
    return null
  }
  const View = sourcesStore.getView(bit.integration, 'main')
  const normalizedItem = normalizeItem(bit)
  return (
    <ItemPropsProvider value={defaultItemProps}>
      <HighlightedSearchable>
        {({ searchBar }) => (
          <>
            <BitTitleBar bit={bit} normalizedItem={normalizedItem} searchBar={searchBar} />
            <View item={bit} normalizedItem={normalizedItem} {...props} />
          </>
        )}
      </HighlightedSearchable>
    </ItemPropsProvider>
  )
}
