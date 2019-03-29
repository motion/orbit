import { List, useStore } from '@o/kit'
import React, { useContext } from 'react'
import { SearchContext } from './index'

export function SearchAppIndex() {
  const context = useContext(SearchContext)
  const searchStore = useStore(context.searchStore)
  return <List listRef={x => console.log('list', x)} shareable items={searchStore.results} />
}
