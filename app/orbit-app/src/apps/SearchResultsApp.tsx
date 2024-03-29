import { AppMainView, createApp, ensure, useReaction } from '@o/kit'
import { Card, CenteredText } from '@o/ui'
import React from 'react'

import { SearchStore } from '../om/SearchStore'
import { BitAppMain } from './BitApp'

export default createApp({
  id: 'searchResults',
  name: 'Search Results',
  icon: 'search',
  app: SearchResultsApp,
})

export function SearchResultsApp() {
  const searchStore = SearchStore.useStore({ react: false })!
  const item = useReaction(() => {
    const item = searchStore.selectedItem
    ensure('item', !!item)
    ensure('not app', !item!.extraData || !item!.extraData.app)
    return item
  })

  if (item && item.item) {
    return (
      <Card margin={14} flex={1} boxShadow={[[0, 5, 20, [0, 0, 0, 0.05]]]} sizeRadius={1.5}>
        <BitAppMain id={`${item.item.id}`} />
      </Card>
    )
  }

  if (item && item.extraData.appIdentifier) {
    return <AppMainView identifier={item.extraData.appIdentifier} viewType="main" />
  }

  return <CenteredText>{(item && item.title) || 'Nothing found'}</CenteredText>
}
