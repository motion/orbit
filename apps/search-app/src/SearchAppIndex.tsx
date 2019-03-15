import { List, useShareMenu } from '@o/kit'
import { useStore } from '@o/use-store'
import React, { useContext } from 'react'
import { SearchContext } from './index'

export function SearchAppIndex() {
  const context = useContext(SearchContext)
  const searchStore = useStore(context.searchStore)
  const items = searchStore.results
  const { getShareMenuItemProps } = useShareMenu()
  return <List items={items} getItemProps={getShareMenuItemProps} />
}
