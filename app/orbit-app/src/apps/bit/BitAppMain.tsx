import { useModel } from '@mcro/bridge'
import { HighlightedSearchable, normalizeItem } from '@mcro/kit'
import { BitModel } from '@mcro/models'
import { ItemPropsProvider } from '@mcro/ui'
import * as React from 'react'
import { AppProps } from '../AppProps'
import { BitTitleBar } from './BitTitlebar'

const defaultItemProps = {
  itemProps: {
    padding: [1, 6],
    '&:hover': {
      background: [0, 0, 0, 0.02],
    },
  },
}

export function BitAppMain(props: AppProps) {
  const [bit] = useModel(BitModel, {
    where: { id: +props.appConfig.id },
    relations: ['people'],
  })
  if (!bit) {
    return null
  }
  const normalizedItem = normalizeItem(bit)
  return (
    <ItemPropsProvider value={defaultItemProps}>
      <HighlightedSearchable>
        {({ searchBar }) => (
          <>
            <BitTitleBar bit={bit} normalizedItem={normalizedItem} searchBar={searchBar} />
            {/* !TODO */}
            {/* <MediaView item={bit} normalizedItem={normalizedItem} {...props} /> */}
          </>
        )}
      </HighlightedSearchable>
    </ItemPropsProvider>
  )
}
