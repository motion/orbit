import { useModel } from '@o/bridge'
import { AppProps, HighlightedSearchable, ItemView } from '@o/kit'
import { BitModel } from '@o/models'
import { ItemPropsProvider } from '@o/ui'
import * as React from 'react'
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

  return (
    <ItemPropsProvider value={defaultItemProps}>
      <HighlightedSearchable>
        {({ searchBar }) => (
          <>
            <BitTitleBar bit={bit} searchBar={searchBar} />
            <ItemView item={bit} />
          </>
        )}
      </HighlightedSearchable>
    </ItemPropsProvider>
  )
}
