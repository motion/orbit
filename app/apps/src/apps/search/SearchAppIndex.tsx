import { AppProps, List, useShareMenu, useStores } from '@mcro/kit'
import * as React from 'react'

export function SearchAppIndex(_: AppProps) {
  // @ts-ignore
  const { searchStore } = useStores()
  const items = searchStore.results
  const { getShareMenuItemProps } = useShareMenu()
  return <List minSelected={0} items={items} getItemProps={getShareMenuItemProps} />
}
