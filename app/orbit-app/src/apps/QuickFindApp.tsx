import { createApp } from '@o/kit'
import SearchApp from '@o/search-app'
import React from 'react'

export default createApp({
  id: 'quickFind',
  icon: 'quickFind',
  name: 'Search',
  app: QuickFindApp,
})

function QuickFindApp() {
  const View = SearchApp.app
  return <View />
}
