import { List, useShareMenu, useStores } from '@mcro/kit'
import { useStoreDebug } from '@mcro/use-store'
import * as React from 'react'

let last = null

export function SearchAppIndex() {
  useStoreDebug()

  // @ts-ignore
  const { searchStore } = useStores()
  const items = searchStore.results

  const { getShareMenuItemProps } = useShareMenu()

  console.warn('1', getShareMenuItemProps === last)
  last = getShareMenuItemProps

  return <List minSelected={0} items={items} getItemProps={getShareMenuItemProps} />
}
