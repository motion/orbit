import { createApp } from '@o/kit'
import { Card, CenteredText } from '@o/ui'
import React from 'react'

import { SearchStore } from '../stores/SearchStore'
import { BitAppMain } from './BitApp'

export default createApp({
  id: 'searchResults',
  name: 'Search Results',
  icon: 'search',
  app: SearchResultsApp,
})

export function SearchResultsApp() {
  const searchStore = SearchStore.useStore()!
  const item = searchStore.selectedItem

  if (item && item.item) {
    return (
      <Card margin={14} flex={1} elevation={1.5} sizeRadius={1.2}>
        <BitAppMain id={`${item.item.id}`} />
      </Card>
    )
  }

  return <CenteredText>Nothing found</CenteredText>
}
