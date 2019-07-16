import { createApp } from '@o/kit'
import { CenteredText } from '@o/ui'
import React from 'react'

import { SearchStore } from '../stores/SearchStore'
import { BitAppMain } from './BitApp'

export default createApp({
  id: 'searchResults',
  name: 'Search Results',
  icon: '',
  app: SearchResultsApp,
})

function SearchResultsApp() {
  const searchStore = SearchStore.useStore()!
  const item = searchStore.selectedItem

  if (item && item.item) {
    return <BitAppMain id={`${item.item.id}`} />
  }

  return <CenteredText>Nothing found</CenteredText>
}
