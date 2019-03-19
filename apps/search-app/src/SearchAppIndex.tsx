import { List, useStore } from '@o/kit'
import React, { useContext } from 'react'
import { SearchContext } from './index'

export function SearchAppIndex() {
  const context = useContext(SearchContext)
  const searchStore = useStore(context.searchStore)
  return <List shareable items={searchStore.results} />
}
